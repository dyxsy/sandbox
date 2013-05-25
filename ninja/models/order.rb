class Order < ActiveRecord::Base
  # attr_accessible :title, :body
  include Sencha::Model
  sencha_fieldset  :grid, [:id,{:investor => [:id]},:instrument_code,:direction,:offset,:volume,:status,:price,:order_time,:local_no,:ex_user_id]

  #belongs_to :account

  belongs_to :investor
end
