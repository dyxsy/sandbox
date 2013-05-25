# encoding: utf-8
class PaymentsController < ApplicationController

  def index
    # payments = get_payments(:page     => params[:page], 
    #                         :per_page => params[:limit])
    # payments = payments.order("created_at DESC")
    # respond_to do |format|
    #   format.json { render :json => { :success => true,
    #                                   :total   => payments.total_count,
    #                                   :records => payments.map{ |payment| payment.to_record(:grid)}
    #                                 }
    #               }
    # end
  end

  def get

    payments = get_payments(:page     => params[:page], 
                            :per_page => params[:limit])
    payments = payments.order("created_at DESC")
    respond_to do |format|
      format.json { render :json => { :success => true,
                                      :total   => payments.total_count,
                                      :records => payments.map{ |payment| payment.to_record(:grid)}
                                    }
                  }
    end
  end

  def search
    
    payments = get_payments(:query    => params[:query],
                            :page     => params[:page],
                            :per_page => params[:limit])
    #根据过滤条件查询,status = 2 全部 status = 1 支付成功 status = 0 正在支付
    if params[:status] && params[:status] < '2'
      if params[:start_total].empty? && params[:end_total].empty?
        payments = payments.finace_with_dateStatus(params[:started_at],params[:ended_at],params[:status])
      else
        payments = payments.finace_with_totalDateStatus(params[:started_at],params[:ended_at],params[:status],
                                                        params[:start_total],params[:end_total])
      end
    else
      if params[:start_total].empty? && params[:end_total].empty?
        payments = payments.finace_with_date(params[:started_at],params[:ended_at])
      else
        payments = payments.finace_with_totalDate(params[:started_at],params[:ended_at],
                                                  params[:start_total],params[:end_total])
      end
    end
    respond_to do |format|
      format.json { render :json => { :success => true,
                                      :total   => payments.total_count,
                                      :records => payments.map{ |payment| payment.to_record(:grid)}
                                    } 
                  }
    end
  end

  def pay
  end

private
  def get_payments(options = {})
    get_list_of_records(Payment, options)
  end

end