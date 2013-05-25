# encoding: utf-8

class PowerBit < ActiveRecord::Base
  include Sencha::Model
  include ActiveRecord::ConnectionAdapters::SchemaStatements
  attr_accessible :group, :action, :text
  sencha_fieldset :grid, [:action,:text]
  
  def self.by_groups
    groups = self.select('DISTINCT `group`')
    result = []
    groups.each do |p|
      power_bits = PowerBit.where(:group => p.group)
      result.push({:group => p.group,:power_bits => power_bits.map{|power_bit| power_bit.to_record(:grid)}})
    end
    result
  end
  
end