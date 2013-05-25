# encoding: utf-8
class SmsController < ApplicationController

  def outbox
    outboxs = get_sms(:page => params[:page],:per_page => params[:limit])
    respond_to do |format|
        format.json{ render :json => { :success => true,
                                       :total   => outboxs.total_count,
                                       :records => outboxs.map{|outbox| outbox.to_record(:outboxs_grid)}
                                     }
                   }
    end
  end

  def search
    outboxs = get_sms(:page     => params[:page],
                      :per_page => params[:limit],
                      :query    => params[:query])

    if params[:status]
      outboxs = case params[:status]
                  when '0'  # 等待发送中
                    outboxs.sms_waiting(params[:started_at],params[:ended_at])
                  when '1'  # 发送成功
                    outboxs.sms_success(params[:started_at],params[:ended_at])
                  when '2'  # 发送失败
                    outboxs.sms_failure(params[:started_at],params[:ended_at])
                  when '3'  # 全部
                    outboxs.sms_all(params[:started_at],params[:ended_at])
                  else      # no status
                    puts "no status"
                    outboxs
                end
    end

    respond_to do |format|
        format.json{ render :json => { :success => true,
                                       :total   => outboxs.total_count,
                                       :records => outboxs.map{|outbox| outbox.to_record(:outboxs_grid)}
                                     }
                   }
    end
  end


  private
  #----------------------------------------------------------------------------
  def get_sms(options = {})
    get_list_of_records(SMS::Outbox, options)
  end

end