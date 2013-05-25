# encoding: utf-8
class InstrumentsController < ApplicationController
  def index
    instruments = get_instruments(:page     => params[:page],
                                  :per_page => params[:limit],
                                  :sort     => params[:sort],
                                  :dir      => params[:dir])
    respond_to do |format|
      format.json { render :json => { :success => true,
                                      :total   => instruments.total_count,
                                      :records => instruments.map{ |instrument| instrument.to_record(:grid)}
                                     }
                   }
    end
  end

  def search
    query = params[:query]
    query || '' unless query.blank?
    instruments = Instrument.search(query)
    respond_to do |format|
      format.json { render :json => { :success => true,
                                      :total   => instruments.count,
                                      :records => instruments.map{ |instrument| instrument.to_record(:grid)}
                                    } 
                  }
    end
  end


private
  def get_instruments(options = {})
    get_list_of_records(Instrument, options)
  end
end
