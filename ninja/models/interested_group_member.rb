class InterestedGroupMember < ActiveRecord::Base
  # attr_accessible :title, :body
  belongs_to :interested_group
  belongs_to :investor
  
end
