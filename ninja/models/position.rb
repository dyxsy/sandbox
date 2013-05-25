class Position < ActiveRecord::Base
  # attr_accessible :title, :body
  include Sencha::Model
  sencha_fieldset :grid, [:id,{:investor => [:id]},:instrument_code,:direction,:pos_type,:vorh,:volume,:available,:cost,:last_price,:commission,:profit,:profit_ratio]
 
  #belongs_to :account
  belongs_to :investor
end
