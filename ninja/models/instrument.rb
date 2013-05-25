class Instrument < ActiveRecord::Base
  include Sencha::Model
  attr_accessible :exchange_name,
                  :code,
                  :subscribed,
                  :volume_multiple,
                  :max_limit_order_volume,
                  :min_limit_order_volume,
                  :is_trading,
                  :price_tick
                 
  sencha_fieldset :grid, [:exchange_name, 
                          :code, 
                          :subscribed, 
                          :volume_multiple, 
                          :is_trading, 
                          :price_tick]

  simple_column_search :code,   :match  => :middle

  scope :order_by,    lambda { |fields,dir| order("#{fields} #{dir}")}

  attr_accessor :action

  def action_label
    case self.action
      when Ninja::Constants::CLOSE_ONLY
        return "close_only"
      when Ninja::Constants::OPEN_ONLY
        return "open_only"
      when Ninja::Constants::STOP_TRADE
        return "stop_trade"
      when Ninja::Constants::OPEN_CLOSE
        return "open_close"
      else
        return ""
    end
  end
  
end
