class CreateRoles < ActiveRecord::Migration
  def change
    create_table :roles do |t|
      t.string      :name                                         # 名称
      t.string      :label                                        # 显示名称
      t.string      :description                                  # 描述
      t.decimal     :permission,  :precision => 50, :scale => 0   # 权限(二进制串)
      t.boolean     :built_in                                     # 是否内置角色
      t.timestamps
    end
    add_index :roles, :name, :unique => true
  end
end
