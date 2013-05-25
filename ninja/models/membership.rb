class Membership < ActiveRecord::Base
  attr_accessible :group_id, :investor_id
  belongs_to :group, :counter_cache => :member_count
  belongs_to :investor

  def self.wait_investor(callback, group_id, page, limit, investors = Investor)
    investor_ids = if group_id
                     self.where(:group_id => group_id).collect{|m| m.investor_id}
                   else
                     []
                   end
    is = investor_ids.empty? ? investors : investors.where("id not in(?)", investor_ids)
    investors = is.page(page).per(limit)
    callback + "(" + "{'totalCount': #{is.count}, 'records': #{investors.to_json} }" + ")"
  end

end
