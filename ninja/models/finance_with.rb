class FinanceWith < ActiveRecord::Base
  include Sencha::Model

  attr_accessible :customer, :login, :mode, :quota, :status, :comment, :margin, 
  				  :current_receivable, :current_paid, :current_init_capital

  sencha_fieldset :grid, [:customer, :login, :mode, :quota, :margin, :current_receivable,
                          :current_paid, :current_init_capital, :status, :comment]

  simple_column_search :match => :middle

  scope :finace_with_date,		lambda{ |started_at, ended_at| where("created_at >=? and created_at <= ?",
                                                                started_at, ended_at)}                 

end
