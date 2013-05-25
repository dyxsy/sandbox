# encoding: utf-8
class InvestorsController < ApplicationController

  def index
    interested_group_ids = params[:interested_group_id].split(",")
    investors = Investor.joins(:groups, :interested_groups, :accounts)
                        .where("accounts.master_account_id is null and groups.id in (?)", interested_group_ids)
                        .limit(50)
    respond_to do |format|
      format.json { render :json => { :success => true,
                                      :records => investors.map{ |investor| investor.to_record(:grid) }
                                    }
                  }
    end
  end

  #投资者列表
  def show_investors
    investors = get_investors(:page => params[:page], 
                              :per_page => params[:limit])
    respond_to do |format|
      format.json { render :json => { :success => true,
                                      :total   => investors.total_count,
                                      :records => investors.map{ |investor| investor.to_record(:grid)}
                                     }
                   }
    end
  end

  def select
    result = Membership.wait_investor(params[:callback],
                                      params[:group_id],
                                      params[:page],
                                      params[:limit])
    respond_to do |format|
      format.json { render :json => result }
    end
  end

  def search
    query = params[:query]
    query || '' unless query.blank?
    investors = Investor.search(query)
    callback = params[:callback]
    result = if callback
               Membership.wait_investor(callback, 
                                        params[:group_id], 
                                        params[:page],
                                        params[:limit],
                                        investors)
             else
               {:success => true, :records => investors.map { |investor| investor.to_record(:grid) } }
             end
    respond_to do |format|
      format.json  { render :json => result }
    end
  end

  # 成交记录
  # =========================================================
  def trades
    investor = Investor.where("id = ?",params[:id]).first
    trades = investor.trades.limit(50)
    # accounts = investor.accounts.limit(50)  
    # trades = []
    # accounts.each do |account|     
    #   acc = account.trades.limit(10)
    #   acc.each do |tr|
    #     trades << tr
    #   end
    # end
      
    if trades
      respond_to do |format|
        format.json { render :json => { :success => true,
                                        :records => trades.map{ |trade| trade.to_record(:grid) }
                                       }

                     }
      end
    else
      respond_to do |format|
          format.json{ render :json => { :success => false, :msg => "找不到成交记录"}}
      end
    end

    rescue ActiveRecord::RecordNotFound
      respond_to do |format|
        format.json { render :json => { :success => false, :msg => "找不到记录"} }
      end

  end

  #该投资者所有账户的子账户的投资者

  def slaves
    investor = Investor.where("id = ?",params[:id]).first  
    
    manager_accounts = investor.accounts.limit(50)
      
    v = []
    manager_accounts.each do |manager_acc|
      accounts = manager_acc.slaves.limit(50)
      accounts.each do |acc| 
       
        v << acc.investor
      end
    end
     
    if v
      investors = v.uniq
      respond_to do |format|
       format.json { render :json => { :success => true,
                                       :records => investors.map{ |investor| investor.to_record(:grid) }
                                     }

                   }
      end
    else
      respond_to do |format|
          format.json{ render :json => { :success => false, :msg => "找不到记录"}}
      end
    end
   rescue ActiveRecord::RecordNotFound
     respond_to do |format|
      format.json { render :json => { :success => false, :msg => "找不到记录"} }
     end
  end

  def group_slave
    investor = Investor.where("id = ?",params[:id]).first  
    manager_accounts = investor.accounts.limit(50)
    interested_group_ids = JSON.parse(params[:interested_group_ids])  
    v = []
    manager_accounts.each do |manager_acc|
      accounts = manager_acc.slaves.limit(50)
      accounts.each do |acc|
        interested_groups = acc.investor.interested_groups
        if interested_groups
          interested_groups.each do |interested_group|
                                   v << acc.investor if interested_group_ids.include?(interested_group.id)
                                 end
        end
      end
    end
    
    if v
      investors = v.uniq
      respond_to do |format|
       format.json { render :json => { :success => true,
                                       :records => investors.map{ |investor| investor.to_record(:grid) }
                                     }

                   }
      end
    else
      respond_to do |format|
          format.json{ render :json => { :success => false, :msg => "找不到记录"}}
      end
    end
  rescue ActiveRecord::RecordNotFound
    respond_to do |format|
      format.json { render :json => { :success => false, :msg => "找不到记录"} }
    end
  end

  # 持仓
  def positions 
    investor = Investor.where("id = ?", params[:id]).first
    positions = investor.positions.limit(50)
     
    respond_to do |format|
        format.json { render :json => { :success => true,
                                        :records => positions.map{ |position| position.to_record(:grid) }
                                       }

                     }
    end
  end

  # 委托
  # ============================================================================
  def orders
    investor = Investor.where("id = ?", params[:id]).first
    orders = investor.orders.limit(50)
    respond_to do |format|
      format.json  { render :json => { :success => true,
                                        :records => orders.map{ |order| order.to_record(:grid) }
                                       }

                     }
    end
  end

  # 可交易合约
  # ============================================================================
  def instrument_ctrls

    investor_id = params[:id]
    instruments = Instrument.all.inject({}) do |acc, instrument|
                     instrument.action = Ninja::Constants.OPEN_CLOSE
                     acc[instrument.id] = instrument
                  end

    InstrumentCtrl.for(investor_id).each do |ic|
      instrument = ic.instrument
      case instrument.forbid
        when Ninja::Constants.OPEN
          instrument.action = Ninja::Constants.CLOSE_ONLY
        when Ninja::Constants.CLOSE
          instrument.action = Ninja::Constants.OPEN_ONLY
        when Ninja::Constants.OPEN_CLOSE
          instrument.action = Ninja::Constants.STOP_TRADING
        else
          # do nothing
      end
      instruments[instrument.id] = instrument
    end

    respond_to do |format|
      format.json  { render :json => { :success => true,
                                        :records => instruments.map do |instrument| 
                                                      instrument.to_record(:grid)  
                                                    end   
                                      }                         
                                     
                    }
     end
  end

  #出金请求
  def cap_out
    @investor = Investor.where("id = ?", params[:id]).first
    render layout: 'ext_access'
  end

  #入金请求
  def cap_in
    @investor = Investor.where("id = ?", params[:id]).first
    render layout: 'ext_access'
  end
  
  def filter

  end

  def create
    if params[:login].upcase != "LK100016"
      result = {:success => false, :msg => "该用户不存在"}
    elsif params[:password] != "123456"
      result = {:success => false, :msg => "密码错误,请重新输入"}
    else
      session[:current_investor] = {:login       => "LK100016",
                                    :investor_id => 1}
      result = {:success => true,
                :msg     => "登录成功",
                :login   => "LK100016",
                :investor_id => 1}
    end 
    # investor = Investor.where(:login => params[:login]).first
    # if investor
    #   session[:current_investor] = {:login       => investor.login,
    #                                 :investor_id => investor.id}
    #   result = {:success => true,
    #             :msg     => "登录成功",
    #             :login   => investor.login,
    #             :investor_id => investor.id}
    # else
    #   result = {:success => false, :msg => "该用户不存在"}
    # end
    respond_to do |format|
      format.json  { render :json => result }
    end
  end

  # 判断当前是否有投资者登录
  # investors/check_session.json                                           AJAX
  #----------------------------------------------------------------------------
  def check_session
    if current_investor
      json_data = {:success => true,
                   :login   => current_investor[:login],
                   :investor_id => current_investor[:investor_id]}
    else 
      json_data = {:success => false}
    end  
    respond_to do |format|
      format.json { render :json => json_data}
    end
  end

  def destroy
    session[:current_investor] = nil
    respond_to do |format|
      format.json { render :json => {:success => true,:msg => '您已成功退出'} }
    end
  end

  def get_investors(options = {})
    get_list_of_records(Investor, options)
  end
   
end
