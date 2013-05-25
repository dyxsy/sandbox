class Withdrawal < ActiveRecord::Base
  include Sencha::Model
  # attr_accessible :title, :body
  attr_accessible :login, :bank, :bank_account, :status, :objective, :updated_at, :comment
              
  sencha_fieldset :grid, [:login, 
                          :bank, 
                          :bank_account, 
                          :status, 
                          :updated_at,
                      	  :comment,
                          :objective,
                          :created_at
                        ]
  simple_column_search :login,   :match => :middle
  #已处理，根据updated_at
  scope :withdrawal_treated,    lambda{|started_at, ended_at| where("updated_at >=? and updated_at <= ? and status >= 0",
                                                                started_at, ended_at)}
  #未处理，根据updated_at
  scope :withdrawal_untreated,  lambda{|started_at, ended_at| where("updated_at >=? and updated_at <= ? and status is NULL",
                                                                started_at, ended_at)}
  #已处理，已出金
  scope :withdrawal_ratify,     lambda{|started_at, ended_at| where("updated_at >=? and updated_at <= ? and status = 1",
                                                                started_at, ended_at)}
  #已处理，未出金
  scope :withdrawal_refuse,     lambda{|started_at, ended_at| where("updated_at >=? and updated_at <= ? and status = 0",
                                                                started_at, ended_at)}
  #全部，根据时间
  scope :withdrawal_date,       lambda{|started_at, ended_at| where("updated_at >=? and updated_at <= ?",
                                                                started_at, ended_at)}
  scope :withdrawal_today,      lambda{ where("to_days(updated_at) = to_days(curdate())")}

  scope :order_by,    lambda { |fields,dir| order("#{fields} #{dir}")}
end
