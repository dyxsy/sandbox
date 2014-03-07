Ext.define('Ninja.Ninja', {
  extend: 'Ext.container.Viewport',
  headerContainer: undefined,
  bodyContainer: undefined,
  id: 'main_viewer',
  mixins: {
    sessionStateful: 'Ninja.util.SessionStateful'
  },
  progressCount: 0,

  initComponent: function() {
    var me = this;
    me.checkRole();
    me.createWebsocket();
          
    Ext.apply(me, {
      layout: {
        type: 'vbox',
        align: 'stretch'
      },
      items: [
        me.createHeaderContainer(),
        me.createMenubar([], []),
        me.createBodyContainer()
      ]
    });
    me.callParent(arguments);
  },
  listeners: {
    beforerender: function(cmp){
      cmp.checkSession();
    }
  },

  /*
   * 创建菜单
   */
  createMenubar: function(buttons, menus) {
    var items = [];
    for (var i = 0; i < buttons.length; i++) {
      items.push(buttons[i]);
    }
    for (var i = 0; i < menus.length; i++) {
      items.push(menus[i]);
    }
    items.push(
      '->', {
        xtype: 'button',
        text: '登录',
        itemId: 'menu_login_btn',
        id: 'menu_login_btn',
        hidden: true,
        handler: Ext.ux.menu.StoreMenu.getHandler('login')
      }, {
        xtype: 'label',
        hidden: true,
        itemId: 'menu_admin_lbl',
        listeners: {
          hide: function() {
            this.setText('');
          }
        }
      }, {
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
  createHeaderContainer: function() {
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
  createBodyContainer: function() {
    var me = this;
    me.bodyContainer = Ext.create('Ext.container.Container', {
      flex: 1,
      layout: 'fit',
      listeners: {
        add: function(cmp) {
          cmp.setLoading(false);
        }
      },
      replace: function(buildCmpFn, callbackFn) {
        me.checkSession();
        this.removeAll();
        Ext.apply(Ext.LoadMask.prototype, {
          msg: "加载中..."
        });
        this.setLoading(true);
        var item = buildCmpFn.call();

        if (callbackFn) {
          this.onAfterAdd = function(cmp, child) {
            callbackFn.call(cmp, cmp, child);
            cmp.un('add', cmp.onAfterAdd);
          };
          this.on('add', this.onAfterAdd);
        }
        this.add(item);
      }
    });
    return me.bodyContainer;
  },

  LoginSyncProgress: function(progress) {
    var me = this;
    console.log(progress);
    me.task.cancel(); // 如果有返回消息,停止延迟器
    me.taskAbnormal.cancel();
    me.taskAbnormal.delay(20000);
    if (progress == 'completed' && me.msgBox) {
      Ext.defer(function() {
        me.msgBox.updateProgress(1, "已完成");
        me.taskAbnormal.cancel();
        Ext.defer(function() {
          me.msgBox.hide();
          me.msgBox.updateProgress(0, '', '');
          me.msgBox = null;
        }, 1000, null, null);
      }, 1500, null, null);
    };
    
    var label = '';
    if (progress instanceof Array) {
      var msg = '';
      label = progress[0];
    } else {
      me.proText = progress;
    };
  },

  createWebsocket: function() {
    var me = this;
    // 进度条隐藏,延迟器
    me.task = new Ext.util.DelayedTask(function() {
      runner.destroy();
      me.msgBox.updateProgress(1, "已完成");
      Ext.defer(function() {
        me.msgBox.hide();
        me.msgBox.updateProgress(0, '', '');
      }, 2000, null, null);
    });

    //进度条异常，提示重新登录
    me.taskAbnormal = new Ext.util.DelayedTask(function() { 
      me.msgBox = Ext.MessageBox.show({
        title: '数据初始化',
        modal: true,
        width: 300,
        wait:false,
        buttons: Ext.Msg.OK,
        closable: false,
        progress: true
      });
      me.msgBox.updateProgress(1, "同步数据异常，请重新登录");
    });
    
    me.progressLabel = {
      'logged_in': '登录成功',

      'sync_admin_investors': '同步管辖范围内投资者',
      'sync_admin_investors_end': '完成同步管辖范围内投资者',
      'sync_admin_investors_failed': '同步管辖范围内投资者失败',

      'sync_adminships': '同步管辖范围内未分组的投资者',
      'sync_adminships_end': '完成同步管辖范围内未分组的投资者',
      'sync_adminships_failed': '同步管辖范围内未分组的投资者失败',

      'sync_groups': '同步用户组',
      'sync_groups_end': '完成同步用户组',
      'sync_groups_failed': '同步用户组失败',

      'sync_monitor_groups': '同步风险监控组',
      'sync_monitor_groups_end': '完成同步风险监控组',
      'sync_monitor_groups_failed': '同步风险监控组失败',

      'sync_monitor_usrs': '同步风险监控组成员',
      'sync_monitor_usrs_end': '完成同步风险监控组成员',
      'sync_monitor_usrs_failed': '同步风险监控组成员失败',

      'sync_monitor_usrs_capitals_end': '完成同步风险监控组成员资金',
      'sync_monitor_usrs_orders_end': '完成同步风险监控组成员报单',
      'sync_monitor_usrs_positions_end': '完成同步风险监控组成员持仓',
      'sync_monitor_usrs_trades_end': '完成同步风险监控组成员成交记录'
    };

    var websocket = Ext.create('Ext.ex.WebSocket', {
      url: Ninja.App.socketBaseURI + 'admins/' + login.userId,
      listeners: {
        open: function() {
          if (document.cookie.match(/firstLogin\=true/)) {
            me.msgBox = Ext.MessageBox.show({
              title: '数据初始化',
              progressText: '初始化中..',
              modal: true,
              width: 300,
              closable: false,
              progress: true,
            });
            me.runner = new Ext.util.TaskRunner();
            me.i = 1;
            me.d = 0;
            me.proText = '';
            me.b = 0/100*2000 + me.d;
            var clockTask = {
              interval: 200,
              run:function(){
                me.d = me.i*10+me.b;
                me.msgBox.updateProgress(me.d/2000, me.progressLabel[me.proText]);
                me.i++;
              }
            };

            me.runner.start(clockTask);
            me.task.delay(15000); //启动延迟器,10秒后执行隐藏进度条
            document.cookie = "firstLogin=false";
          }
        },
        close: Ext.emptyFn,
        message: function(ws, message) {
          if (message) {
            var resp = Ext.JSON.decode(message);
            if (resp.progress) {
              me.LoginSyncProgress(resp.progress);
            };

            if (resp.notification) {
              switch (resp.notification) {
                case "conn_closed":
                  msg = '期货服务端连接断开';
                  break;
                case "conn_failed":
                  msg = '期货服务端连接重新连接失败';
                  break;
                case "conn_suc":
                  msg = '期货服务端连接重新连接成功';
                  break;
                case "dup_session":
                  handler = Ext.ux.menu.StoreMenu.getHandler('dupSession');
                  handler();
                  return;
              };

              if (typeof msg != "undefined") {
                Ext.create('Ninja.window.NotificationWindow', {
                  html: msg || ''
                }).show();
              }
            }
          }
        }
      }
    });

    Ext.ex.WebSocketManager.register(websocket);
  }
});