class Currency < ActiveRecord::Base
  attr_accessible :name, :symbol

  def self.yuan
    Currency.where(:symbol => "yuan").first
  end
end
