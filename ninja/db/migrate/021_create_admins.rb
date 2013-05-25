class CreateAdmins < ActiveRecord::Migration
  def change
    create_table :admins do |t|
      t.string        :name         # 姓名
      t.string        :login        # 用户名
      t.integer       :out_id       # 外部id, 用于数据搬迁
      t.integer       :role_id      # 角色
      t.string        :comment      # 备注

      t.timestamps
    end
  end
end
