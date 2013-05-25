/*
 * 定义各菜单栏各菜单对应的执行函数
 * 以菜单id作为方法名
 */
function defineMenuHandler(){
  Ext.ux.menu.StoreMenu.addHandler({
    // 切换工作空间
    change_workspace: function(options){
      var bodyContainer = Ext.ComponentQuery.query('viewport')[0].bodyContainer;
      options = options || {};
      bodyContainer.replace(function(){
        var cmp = Ext.getCmp(options.id);
        if(!cmp){
          var cfg = options.config || {};
          cfg.id = options.id;
          cmp =  Ext.create(options.className, cfg);
        }
        return cmp;
      }, options.callback);
    },

    // 登录
    login: function(){
      var win = Ext.getCmp('window_login');
      if(!win){
        win = Ext.create('Ninja.window.LoginDialog');
        //win.checkSessionAndShow();
        win.show();
      }
    },

    // 退出
    logout: function(){
      Ext.Msg.confirm('退出', '您确定要退出登录吗？', function(rs){
       if (rs == 'yes'){
          Ext.Ajax.request({
            url: '/logout.json',
            method: 'DELETE',
            success: function(response, opts) {
              window.location.href = "/";
              var obj = Ext.decode(response.responseText);
              login.clearData();
              var tb        = Ext.getCmp('main_toolbar'),
                investorLbl = tb.getComponent('menu_admin_lbl'),
                logoutBtn   = tb.getComponent('menu_logout_btn');
                loginBtn    = tb.getComponent('menu_login_btn');
              loginBtn.show();
              investorLbl.setText("");
              investorLbl.hide();
              logoutBtn.hide();
              Ext.create('Ninja.window.NotificationWindow', {
                html: obj.msg
              }).show();
            },
            failure: function(response, opts) {
              Ext.create('Ninja.window.NotificationWindow', {
                html: 'server-side failure with status code ' + response.status
              }).show();
            }
          });
        }
      });
    },
     // 首页
    home: function(){
      Ext.ux.menu.StoreMenu.getHandler('change_workspace').call(this, {
        id: 'home',
        //className: 'Ninja.panel.MyInvestorsPanel'
        className: 'Ninja.panel.InvestorsGroupPanel'
      });
      Ext.History.add("home");
    },
    
    // 权限配置
    permissions: function(){
      Ext.ux.menu.StoreMenu.getHandler('change_workspace').call(this, {
        id: 'permissions',
        className: 'Ninja.panel.PermissionsPanel'
      });
      Ext.History.add("permissions");
    },

    // 菜单配置
    menus: function(){
      Ext.ux.menu.StoreMenu.getHandler('change_workspace').call(this, {
        id: 'menus',
        className: 'Ninja.panel.MenuManagement'
      });
      Ext.History.add("menus");
    },
    admins: function(){
      Ext.ux.menu.StoreMenu.getHandler('change_workspace').call(this, {
        id: 'admins',
        className: 'Ninja.grid.AdminsGrid'
      });
      Ext.History.add("admins");
    },
    quotations: function(){
      var win = Ext.create('Ninja.window.MarketTicktWindow');
      win.show();
    },
    investors: function(){
      Ext.ux.menu.StoreMenu.getHandler('change_workspace').call(this, {
        id: 'investors',
        className: 'Ninja.panel.InvestorsPanel'
      });
      Ext.History.add("investors");
    },
    my_investors: function(){
      Ext.ux.menu.StoreMenu.getHandler('change_workspace').call(this, {
        id: 'my_investors',
        className: 'Ninja.panel.MyInvestorsPanel'
      });
    },
    interested_groups: function(){
      Ext.ux.menu.StoreMenu.getHandler('change_workspace').call(this, {
        id: 'interested_groups',
        className: 'Ninja.panel.InterestedGroupPanel'
      });
      Ext.History.add("interested_groups");
    },
    investor_groups: function(){
      Ext.ux.menu.StoreMenu.getHandler('change_workspace').call(this, {
        id: 'investor_groups',
        className: 'Ninja.panel.InvestorsGroupPanel'
      });
      Ext.History.add("investor_groups");
    },
    data_manager: function(){
      Ext.ux.menu.StoreMenu.getHandler('change_workspace').call(this, {
        id: 'data_manager',
        className: 'Ninja.grid.InstrumentsGrid'
      });
    },
    payments: function(){
      Ext.ux.menu.StoreMenu.getHandler('change_workspace').call(this, {
        id: 'payments',
        className: 'Ninja.grid.PaymentsGrid'
      });
      Ext.History.add("payments");
    },

    trades: function(){
      Ext.ux.menu.StoreMenu.getHandler('change_workspace').call(this, {
        id: 'trades',
        className: 'Ninja.grid.TradesRecordGrid'
      });
      Ext.History.add("trades");
    },

    cap_in_outs: function(){
      Ext.ux.menu.StoreMenu.getHandler('change_workspace').call(this, {
        id: 'cap_in_outs',
        className: 'Ninja.panel.CapitalInOutsTabPanel'
      });
      Ext.History.add("cap_in_outs");
    },

    sms_list: function(){
      Ext.ux.menu.StoreMenu.getHandler('change_workspace').call(this, {
        id: 'sms_list',
        className: 'Ninja.grid.SMSGrid'
      });
      Ext.History.add("sms_list");
    },

    settlements: function(){
      Ext.ux.menu.StoreMenu.getHandler('change_workspace').call(this, {
        id: 'settlements',
        className: 'Ninja.grid.FinanceWithGrid'
      });
      Ext.History.add("settlements");
    },

    test: function(){
      Ext.ux.menu.StoreMenu.getHandler('change_workspace').call(this, {
        id: 'test',
        className: 'Ninja.panel.MyInvestorsPanel'
      });
      Ext.History.add("test");
    }

  });
}

// 存放用户登录有的信息,退出时将被清除
Ext.define("Ninja.Login",{
  extend: 'Object',
  loginName: undefined,
  abbName: undefined,
  investorId: undefined,
  role: undefined,
  phaseId:undefined,
  startedAt:undefined,
  prefs: {},

  constructor: function(config){
    Ext.apply(this,config);
  },
  getLoginName: function(){
    return this.loginName;
  },
  getPref: function(Key){
    return this.prefs[Key];
  },
  getabbName: function(){
    return this.abbName;
  },
  getRole: function(){
    return this.role;
  },
  getInvestorId: function(){
    return this.investorId;
  },
  getStartedAt: function(){
    return this.startedAt;
  },
  getPhaseId: function(){
    return this.phaseId;
  },
  clearData: function(){
    this.investorId = undefined;
    this.loginName  = undefined;
    this.abbName    = undefined;
    this.role       = undefined;
    this.prefs      = undefined;
    this.phaseId    = undefined;
    this.startedAt  = undefined;
  }
});

Ext.define('Ninja.App', {
  singleton: true,
  
  socketBaseURI : undefined,

  init: function(options){
    var me = this,
      options = options || {};

    me.socketBaseURI = options.websocketBaseURI || 'ws://127.0.0.1:9090';

    // 浏览器低于IE7一下，包过IE7，显示升级页面
    if(Ext.ieVersion <=7 && Ext.ieVersion > 0){
      var browserWarning = Ext.create("Ninja.BrowserWarning");
      browserWarning.show();
    }else{
      Ext.QuickTips.init();
      var viewer = new Ninja.Ninja();
      defineMenuHandler();
    }
     Ext.ux.menu.StoreMenu.getHandler('home').call();
  }
});