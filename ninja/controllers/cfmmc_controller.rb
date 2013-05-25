# encoding: utf-8
require 'rubygems'
require 'csv'
class CfmmcController < ApplicationController
  def index
  end

  def create
    key_hash = {0 => :instrument_code, 
                1 => :direction, 
                2 => :vorh, 
                3 => :cost,
                4 => :volume,
                5 => :amount, 
                6 => :offset,
                7 => :commission,
                8 => :close_profit}
    josn_resp = { :success => true }
    begin
      CfmmcTrade.transaction do
        CfmmcTrade.delete_all
        read_csv(params[:file].read, key_hash) do |row, index|
          direction = 1
          vorh      = 1
          offset    = 1
          if params["category"].to_s == "utf8"
            direction_str = row[:direction].mb_chars.lstrip.to_s
            vorh_str      = row[:vorh].mb_chars.lstrip.to_s
            offset_str    = row[:offset].mb_chars.lstrip.to_s
            instrument_str= row[:instrument_code].mb_chars.lstrip.to_s
          else
            direction_str = row[:direction].encode("UTF-8", "GBK")
            vorh_str      = row[:vorh].encode.encode("UTF-8", "GBK")
            offset_str    = row[:offset].encode.encode("UTF-8", "GBK")
            instrument_str= row[:instrument_code].encode("UTF-8", "GBK")
            direction_str = direction_str.mb_chars.lstrip.to_s
            vorh_str      = vorh_str.mb_chars.lstrip.to_s
            offset_str    = offset_str.mb_chars.lstrip.to_s
            instrument_str= instrument_str.mb_chars.lstrip.to_s
          end
          if instrument_str != "合约"
            direction = 0 if direction_str == "卖"
            vorh = 3      if vorh_str == "套保"
            offset = 2    if offset_str == "平"
              CfmmcTrade.create(:instrument_code => row[:instrument_code], 
                                :direction       => direction, 
                                :vorh            => vorh, 
                                :offset          => offset, 
                                :volume          => row[:volume],
                                :close_profit    => row[:close_profit],
                                :cost            => row[:cost].gsub(",", ""),
                                :amount          => row[:amount].gsub(",", ""),
                                :commission      => row[:commission].gsub(",", ""))
          end
        end
      end
    rescue Exception => e
      josn_resp = { :success => false, :msg => "你导数的数据编码错误,请选择正确的编码格式导入" }
    end
    response.content_type = Mime::HTML
    respond_to do |format|
      format.json{ render :json => josn_resp }
    end
  end

  def index3
    cfmmc_trades = get_cfmmc_trade(:page     => params[:page],
                                   :per_page => params[:limit],
                                   :sort     => params[:sort],
                                   :dir      => params[:dir])
    respond_to do |format|
      format.json { render :json => { :success => true,
                                      :total   => cfmmc_trades.total_count,
                                      :records => cfmmc_trades.map{ |cfmmc_trade| cfmmc_trade.to_record(:grid)}
                                     }
                   }
    end
  end

private

  def get_cfmmc_trade(options = {})
    get_list_of_records(CfmmcTrade, options)
  end

  def read_csv(file, key_hash) 
    CSV.parse(file) do |row|

      row_hash = {}
      for i in 0...row.count do
        key = key_hash[i]
        row_hash[key] = row[i] if key
      end
      next if row_hash.empty?
            
      yield(row_hash, i)
    end
  end
end
