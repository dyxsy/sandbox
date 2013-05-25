class CreateGroups < ActiveRecord::Migration
  def change
    create_table :groups do |t|    # 投资者分组
      t.integer :admin_id                          # 管理员id
      t.string  :name                              # 名称
      t.string  :notification_nums                 # 通知号码
      t.string  :service_num                       # 客服号码
      t.integer :member_count,  :default => 0      # 组成员数量
      t.integer :out_id  

      t.timestamps
    end
    
    add_index   :groups,   :name
    add_index   :groups,   :out_id
  end

end
