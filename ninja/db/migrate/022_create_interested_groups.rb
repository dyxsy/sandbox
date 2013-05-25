class CreateInterestedGroups < ActiveRecord::Migration
  def change
    create_table :interested_groups do |t|
      t.integer        :user_id                       # 柜员ID
      t.string         :name                          # 名称
      t.integer        :member_count,  :default => 0  # 人数
      t.integer        :out_id                        # 数据迁移ID

      t.timestamps
    end

    add_index :interested_groups, :user_id
    add_index :interested_groups, :member_count
    add_index :interested_groups, :out_id
  end
end
