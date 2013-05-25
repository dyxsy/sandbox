class CreateInterestedGroupMembers < ActiveRecord::Migration
  def change
    create_table :interested_group_members do |t|
      t.integer       :interested_group_id     # 风控组ID
      t.integer       :investor_id             # 投资者

      t.timestamps
    end

    add_index :interested_group_members, :interested_group_id
    add_index :interested_group_members, :investor_id
  end
end
