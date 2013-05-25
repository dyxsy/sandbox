# encoding: utf-8
class FinanceWithsController < ApplicationController

  def create
    
    finace_with = FinanceWith.new(params[:finance_with])
    if finace_with.save
      result = true
    else
      result = false
    end
    respond_to do |format|
      format.json { render :json => {:success => result } }
    end
  end

  def index
    finace_withs = get_finance_withs(:page => params[:page], :per_page => params[:limit])
    respond_to do |format|
      format.json { render :json => { :success => true,
                                      :tatal   => finace_withs.total_count,
                                      :records => finace_withs.map{ |finace_with| finace_with.to_record(:grid) }
                                    }
                  }
    end
  end

  def search
    finace_withs = get_finance_withs(
                                     :page  => params[:page],
                                     :per_page => params[:limit])

    finace_withs = finace_withs.finace_with_date(params[:started_at],params[:ended_at])

    respond_to do |format|
      format.json { render :json => { :success => true,
                                      :total   => finace_withs.total_count,
                                      :records => finace_withs.map{ |finace_with| finace_with.to_record(:grid)}
        }
      }
    end
  end

  private
    def get_finance_withs(options)
      get_list_of_records(FinanceWith, options)
    end
  end
