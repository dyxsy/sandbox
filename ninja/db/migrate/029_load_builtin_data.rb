# encoding: utf-8
class LoadBuiltinData < ActiveRecord::Migration
  def up
    built_in_roles
    built_in_menus
    built_in_users
    built_in_currency
    built_in_power
  end
  
  def down
  end
  
private 
  def built_in_roles
    root = Role.create( :name  => 'root',
                        :label => '系统管理员',
                        :description => '系统管理员可以配置角色以及相关权限',
                        :built_in => true,
                        :permission => 1023)
    admin = Role.create( :name  => 'admin',
                         :label => '柜员',
                         :description => '柜员用于管理期货内的各项业务',
                         :built_in => true,
                         :permission => 0)

  end

  def built_in_menus
    root  = Menu.create(:name  => 'root')
    home  = Menu.create(:name  => 'home',
                        :label => '首页',
                        :parent_id => root.id)

    investors = Menu.create(:label => '投资者管理',
                            :parent_id => root.id);
    investors_list = Menu.create(:name => 'investors',
                                 :label => '投资者列表',
                                 :parent_id => investors.id);
    my_investors = Menu.create(:name  => 'my_investors',
                               :label => '我的用户',
                               :parent_id => investors.id);
    interested_groups = Menu.create(:name => 'interested_groups',
                                    :label => '风控组',
                                    :parent_id => investors.id);
    investor_groups = Menu.create(:name => 'investor_groups',
                                   :label => '投资者分组',
                                   :parent_id => investors.id);

    system   = Menu.create(:label => '系统设置',
                           :parent_id => root.id)
    logs     = Menu.create(:name => 'system_logs',
                           :label => '系统日志',
                           :parent_id => system.id)
    permissions = Menu.create(:name => 'permissions',
                              :label => '权限配置',
                              :parent_id => system.id)
    menus    = Menu.create(:name => 'menus',
                           :label => '菜单配置',
                           :parent_id => system.id)
    admins = Menu.create(:name => 'admins',
                        :label => '柜员帐号',
                        :parent_id => system.id)
    #行情
    quotations = Menu.create(:name => 'quotations',
                             :label => '行情',
                             :parent_id => system.id)

    data_manager = Menu.create(:name => 'data_manager',
                             :label => '数据管理',
                             :parent_id => root.id)

    instruments = Menu.create(:name => 'data_manager',
                             :label => '合约管理',
                             :parent_id => data_manager.id)

    others = Menu.create(:name  => 'others',
                         :label => '其他业务',
                         :parent_id => root.id)

    payments = Menu.create(:name => 'payments',
                           :label => '第三方支付',
                           :parent_id => others.id)

    test = Menu.create(:name => 'test',
                       :label => '三级制',
                       :parent_id => others.id)

    finance_withs = Menu.create(:name  => 'finance_withs',
                                :label => '配资管理',
                                :parent_id => root.id)

    cap_in_outs = Menu.create(:name  => 'cap_in_outs',
                              :label => '出入金列表',
                              :parent_id => finance_withs.id)

    sms_list = Menu.create(:name  => 'sms_list',
                           :label => '短信发送列表',
                           :parent_id => finance_withs.id)

    settlements = Menu.create(:name  => 'settlements',
                              :label => '结算管理',
                              :parent_id => finance_withs.id)

    as_root = Role.root

    as_root.menus = [home, investors_list, interested_groups, investor_groups, 
                     logs, permissions, menus, instruments, payments, admins,
		                 test, cap_in_outs, sms_list, settlements]

    as_root.save

  end

  def built_in_users
    root = User.new( :login => "root",
                     #:password => "root@lktz",
                     :role_id  => Role.root.id)
    root.save!(:validate => false)
  end

  def built_in_power

    create_role = PowerBit.create(:group => "用户管理",
                                  :action => "create_role",
                                  :text   => "添加角色")
    update_role = PowerBit.create(:group => "用户管理",
                                  :action => "update_role",
                                  :text   => "修改角色")
    destory_role = PowerBit.create(:group => "用户管理",
                                   :action => "destory_role",
                                   :text   => "删除角色") 


    menu_config = PowerBit.create(:group => "系统配置",
                                  :action => "menu_config",
                                  :text   => "菜单配置")
    permission_config = PowerBit.create(:group => "系统配置",
                                        :action => "permission_config",
                                        :text   => "权限配置")

  end

  def built_in_currency
    yuan = Currency.create(:name => "人民币", :symbol => "yuan")
  end
end