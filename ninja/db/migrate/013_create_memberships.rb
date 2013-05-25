class CreateMemberships < ActiveRecord::Migration
  def change
    create_table :memberships do |t|  # 成员
      t.integer     :investor_id     # 投资者ID
      t.integer     :group_id        # 用户组ID 
      t.timestamps
    end

    add_index :memberships, [:investor_id, :group_id],  :unique => true
  end
end
