Ext.define('Ninja.Ninja', {
  extend: 'Ext.container.Viewport',
  headerContainer: undefined,
  bodyContainer: undefined,
  id: 'main_viewer',
  mixins: {
    sessionStateful: 'Ninja.util.SessionStateful'
  },
  initComponent: function() {
    var me = this;
    Ext.apply(me, {
      layout: {
        type: 'vbox',
        align: 'stretch'
      },
      items: [ 
        me.createHeaderContainer(), 
        me.createMenubar([],[]), 
        me.createBodyContainer()
      ]
    });
    me.callParent(arguments);
  },
  listeners:{
    afterrender: function(cmp){
      // 判断登录的用户的角色，并根据用户的角色加载对应的菜单
      cmp.checkRole(cmp);
    }
  },

  /*
   * 创建菜单
   */
  createMenubar: function(buttons,menus){
    var items = [];
    for(var i = 0 ; i< buttons.length; i++){
      items.push(buttons[i]);
    }
    for(var i = 0 ; i< menus.length; i++){
      items.push(menus[i]);
    }
    items.push(
      '->',
      { xtype: 'button', 
        text: '登录',
        itemId: 'menu_login_btn',
        id: 'menu_login_btn',
        hidden: true,
        handler: Ext.ux.menu.StoreMenu.getHandler('login')
      },
      {
        xtype: 'label',
        hidden: true,
        itemId: 'menu_admin_lbl',
        listeners: {
          hide: function(){
            this.setText('');
          }
        }
      },
      {
        xtype: 'button',
        text: '退出',
        hidden: true,
        itemId: 'menu_logout_btn',
        handler: Ext.ux.menu.StoreMenu.getHandler('logout')
      }); 
    var bar = Ext.create('Ext.toolbar.Toolbar', {
      id: 'main_toolbar',
      height: 30,
      items: items
    });
    return bar;
  },
  /*
   * 创建页头容器
   */
  createHeaderContainer: function(){
    var me = this;
    me.headerContainer = Ext.create('Ext.container.Container', {
      id: 'headerContainer'
      // cls: 'ninja-header'
    });
    return me.headerContainer;
  },
  
  /*
   * 创建页中主体容器
   */
  createBodyContainer: function(){
    var me = this;
    me.bodyContainer = Ext.create('Ext.container.Container', {
      flex: 1,
      layout: 'fit',
      listeners: {
        add: function(cmp){
          cmp.setLoading(false);
        }
      },
      replace: function(buildCmpFn, callbackFn){
        this.removeAll();
        Ext.apply(Ext.LoadMask.prototype, { msg: "加载中..."});
        this.setLoading(true);
        var item = buildCmpFn.call();

        if(callbackFn){
          this.onAfterAdd = function(cmp, child){
            callbackFn.call(cmp, cmp, child);
            cmp.un('add', cmp.onAfterAdd);
          };
          this.on('add', this.onAfterAdd);
        }
        this.add(item);
      }
    });
    return me.bodyContainer;
  }
  
});

