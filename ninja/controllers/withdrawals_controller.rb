# encoding: utf-8
class WithdrawalsController < ApplicationController
  def index
  end

  def create
    bank = if params[:bank_name]
             params[:bank] << "-" + params[:bank_name]
           else
             params[:bank]
           end
    withdrawal = Withdrawal.new(:login        => params[:login],
                                :bank         => bank,
                                :objective    => params[:objective],
                                :bank_account => params[:bank_account])

    investor = Investor.where(:login => params[:login]).first
    group = investor ? investor.groups.first : ""
    service_num = group.blank? ? "" : group.service_num

    if withdrawal.save
      flag, @result = true, "出金请求提交成功!"
    else
      flag, @result = false, "出金请求提交失败!"
    end

    respond_to do |format|
     format.json { render :json => {:success => flag, :msg => @result, :service_num => service_num}}
     format.html 
    end
  end

  def search
    withdrawals = get_withdrawals(:query    => params[:query],
                                  :page     => params[:page],
                                  :per_page => params[:limit])
    if params[:status]
      withdrawals = case params[:status]
                      when '0' # 未处理
                        withdrawals.withdrawal_untreated(params[:started_at],params[:ended_at])
                      when '1' # 已处理
                        withdrawals.withdrawal_treated(params[:started_at],params[:ended_at])
                      when '2' # 已处理-已出金
                        withdrawals.withdrawal_ratify(params[:started_at],params[:ended_at])
                      when '3' # 已处理-未出金
                        withdrawals.withdrawal_refuse(params[:started_at],params[:ended_at])
                      else     #全部,根据时间
                        withdrawals.withdrawal_date(params[:started_at],params[:ended_at])
                      end
    end
    respond_to do |format|
      format.json { render :json => { :success => true,
                                         :total   => withdrawals.total_count,
                                         :records => withdrawals.map { |withdrawal| withdrawal.to_record(:grid)}
        }
      }
    end
  end

  def modify
    withdrawal_ids = JSON.parse(params[:withdrawal_ids])
    withdrawal_ids.each do |withdrawal_ids|
      withdrawal = Withdrawal.where(:id => withdrawal_ids).first
      withdrawal.update_attributes(:status => params[:status],
                                       :comment => params[:comment]
       )
    end
    respond_to do |format|
      format.json { render :json => {:success => true}}
    end
  end

  def get
    withdrawals = get_withdrawals(:page     => params[:page],
                                     :per_page => params[:limit],
                                     :sort     => params[:sort],
                                     :dir      => params[:dir])
    withdrawals = withdrawals.withdrawal_today
    respond_to do |format|
      format.json { render :json => { :success => true,
                                         :total   => withdrawals.total_count,
                                         :records => withdrawals.map{ |withdrawal| withdrawal.to_record(:grid)}
      }
    }
    end
  end

  private

  def get_withdrawals(options = {})
    get_list_of_records(Withdrawal, options)
  end
end