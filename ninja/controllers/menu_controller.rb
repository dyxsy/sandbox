# encoding: utf-8
class MenuController < ApplicationController

  def index
    #判断当前session中是否有用户存在，有加载用户对应的菜单，否则加载匿名角色对应的菜单
    # role = Role.anonymous
    # role = current_user.role ? current_user.role : role if current_user
    menu_tree = act_as_tree(current_user.role.menus)
    respond_to do |format|
      format.json { render :json => { :records => menu_tree, :success => true}}
    end
  end

  def act_as_tree(items)
    parent = {}
    result = []
    items.each do |i|
      if i.parent_id.to_i == 1
        result.push({ :name => i.name,  
                      :label => i.label,
                      :childreen => []
                    })
      else
        menu = Menu.where(:id => i.parent_id.to_i).first
        parent[i.parent_id] = menu.label
      end
    end
    parent.each do |key, value|
      menus = items.where(:parent_id => key.to_i).order("menu_id ASC")
      result.push({ :name => "",  
                    :label => value,
                    :childreen => menus.map{|menu| menu.to_record(:grid)}
                  })
    end
    return result 
  end
end
