class Trade < ActiveRecord::Base
  include Sencha::Model
  # attr_accessible :title, :body
  sencha_fieldset :grid, [:id, {:investor => [:id]},:instrument_code, :volume, :cost, :trade_time]

 # belongs_to :account
  belongs_to :investor
end
