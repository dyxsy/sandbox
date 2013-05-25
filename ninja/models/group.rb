class Group < ActiveRecord::Base
  include Sencha::Model
  attr_accessible :name, :notification_nums, :service_num, :admin_id
  sencha_fieldset :grid, [:id, :name, :notification_nums, :service_num, :member_count]
  has_many :memberships
  has_many :investors, :through => :memberships
  belongs_to :admin

end