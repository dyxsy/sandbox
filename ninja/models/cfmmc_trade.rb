class CfmmcTrade < ActiveRecord::Base
  # attr_accessible :title, :body
  include Sencha::Model
  # attr_accessible :title, :body
  attr_accessible :instrument_code, 
                  :direction, 
                  :vorh, 
                  :offset, 
                  :volume,
                  :close_profit,
                  :cost,
                  :amount,
                  :commission
                 
  sencha_fieldset :grid, [:instrument_code, 
                          :direction, 
                          :vorh, 
                          :offset, 
                          :volume,
                          :close_profit,
                          :cost,
                          :amount,
                          :commission]
end