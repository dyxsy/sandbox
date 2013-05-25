class Investor < ActiveRecord::Base
  # attr_accessible :title, :body
  include Sencha::Model
  sencha_fieldset :grid, [:id, :name, :login, :out_id,
                          {:yuan_account => [:id,:current_init_capital, :total, 
                                             :available, :margin, :risk_degree, 
                                             :position_profit, :close_profit2, :profit2
                                            ]
                          }
                         ]

  sencha_fieldset :members_grid, [:id, :name, :login]

  has_many :memberships
  has_many :groups, :through => :memberships

  has_many :interested_group_members
  has_many :interested_groups, :through => :interested_group_members

  has_one :yuan_account,  :class_name => "Account", :include => "currency", :conditions => "currencies.symbol = 'yuan'"
  
  has_many :accounts

  has_many :trades

  has_many :orders
  
  has_many :positions

  has_many :instrument_ctrls
  
  simple_column_search :login, :name,  :match  => :middle 


end
