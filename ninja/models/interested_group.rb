class InterestedGroup < ActiveRecord::Base
  # attr_accessible :title, :body
  attr_accessible :name, :out_id, :member_count
  include Sencha::Model
  sencha_fieldset :grid, [:id, :name, :member_count, :out_id]

  has_many   :interested_group_members
  has_many   :investors, :through => :interested_group_members
end
