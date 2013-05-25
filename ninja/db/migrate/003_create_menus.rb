class CreateMenus < ActiveRecord::Migration
  def change
    create_table :menus do |t|
      t.string  :parent_id    # 上级菜单标签
      t.string  :name         
      t.string  :label        # 显示名称 
      t.timestamps
    end
    add_index  :menus, :parent_id
  end
end
