class Account < ActiveRecord::Base
  # attr_accessible :title, :body
  include Sencha::Model
  
  belongs_to :investor
  belongs_to :currency
  #has_many :trades
  #has_many :positions

  def slaves
    Account.where("master_account_id =?",self.id)
  end

  def close_profit2
    return self.close_profit - self.commission
  end

  def profit2
    return self.position_profit + self.close_profit2
  end
end
