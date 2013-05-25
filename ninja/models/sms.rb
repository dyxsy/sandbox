# encoding: utf-8
module SMS
  class Inbox < ActiveRecord::Base
    self.table_name = 'inbox'
    establish_connection :sms
  end

  class Outbox < ActiveRecord::Base
    include Sencha::Model
    self.table_name = 'outbox'
    establish_connection :sms
    attr_accessible :number, :text, :insertdate, :scheduled_at, :handler, :objective
    sencha_fieldset :outboxs_grid, [:number, :text, :processed_date, :processed, :error]
    
    simple_column_search :number,   :match  => :middle

    default_scope  order("processed_date DESC")
    scope :sms_all,     lambda{|started_at, ended_at| where("insertdate >= ? and insertdate < ?",
                                                            started_at, ended_at)}
    scope :sms_waiting, lambda{|started_at, ended_at| where("insertdate >= ? and insertdate < ? and processed = 0",
                                                            started_at, ended_at)}
    scope :sms_failure, lambda{|started_at, ended_at| where("processed_date >= ? and processed_date < ? and error > 0 and processed = 1",
                                                            started_at, ended_at)}
    scope :sms_success, lambda{|started_at, ended_at| where("processed_date >= ? and processed_date < ? and error <= 0 and processed = 1",
                                                            started_at, ended_at)}

  end 
end