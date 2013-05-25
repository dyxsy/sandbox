class CreateMenusRoles < ActiveRecord::Migration
  def change
    create_table :menus_roles, :id => false do |t|
      t.integer         :menu_id          # 菜单ID 
      t.integer         :role_id          # 角色ID
    end

    add_index :menus_roles, :menu_id
    add_index :menus_roles, :role_id
  end
end
