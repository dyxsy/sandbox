Ext.define('Ninja.util.SessionStateful', {
  checkSessionAndShow: function(checkSessionUrl){
    var checkSessionUrl = checkSessionUrl || '/admins/check_sessions.json';
    Ext.Ajax.request({
      url: '/users/check_session.json',
      method: 'GET',
      scope: this,
      success: function(response){
        var text = response.responseText;
        if(text && text != "") {
          var resp = Ext.JSON.decode(text); 
          if(resp.success){
            this.onSessionOnline(resp); 
          }else{
            this.onSessionOffline(resp);
          }
        }
      }
    });
  },
  onSessionOnline: function(resp){
    document.getElementById('content').style.display='none';
    // var appConf = {websocketBaseURI: "ws://127.0.0.1:8880/"};
    var appConf = {websocketBaseURI: "ws://192.168.1.105:8880/"};
    Ninja.App.init(appConf);
  },
  
  onSessionOffline: function(resp){
    // var win = Ext.create('Ninja.window.LoginDialog', {
    //   rememberLoginField: true,
    //   listeners: {
    //     success: {
    //       fn: function(){
    //         this.show();
    //       },
    //       scope: this
    //     }
    //   }
    // });
    this.show();
  },

  checkRole :function(cmp){
    Ext.Ajax.request({
      url: '/admins/profile.json',
      method: 'GET',
      scope: cmp,
      async:false,
      success: function(response){
        var text = response.responseText;
        if(text && text != "") {
          var resp = Ext.JSON.decode(text); 
          if(resp.success){
            var info,loginName,lbl,userId,userRole;
            if(resp.data){
              info        = resp.data;
              loginName   = info.login;
              userId      = info.id;              
              userRole    = info.user_role;
            }
            // 用户登录后，将用户信息保存在
            login.loginName = loginName;
            login.userId    = userId;
            login.role      = userRole;

            lbl = '{0}:{1}您已登录系统。';

            Ext.Ajax.request({
              url: '/menu.json',
              method: 'GET',
              scope: cmp,
              success: function(response){
                var text = response.responseText,
                  resp = Ext.JSON.decode(text);
                if(resp.success){
                  var records = resp.records,
                    buttons   = [],
                    menus     = [];
                  
                  // 登录成功后判断角色,删除默认菜单
                  cmp.remove("main_toolbar");

                  for(var i = 0; i < records.length; i++){
                    var childreen = records[i].childreen,
                      menusConfig = [];
                    // 没有子菜单的情况下，创建按钮，否则创建菜单
                    if(childreen.length == 0 && !Ext.isEmpty(records[i].name,false)){
                      buttons.push({ 
                        xtype: 'button', 
                        text: records[i].label,
                        handler: Ext.ux.menu.StoreMenu.getHandler(records[i].name.toString()) 
                      });
                    }
                    else if(childreen.length != 0 && Ext.isEmpty(records[i].name,false)){
                      for(var j = 0;j < childreen.length; j++){
                        var name = childreen[j].name,
                          label = childreen[j].label;
                        menusConfig.push({
                          text:label,
                          handler: Ext.ux.menu.StoreMenu.getHandler(name.toString())
                        });
                      }
                      menus.push({ 
                        xtype: 'button', 
                        text: records[i].label, 
                        menu:menusConfig
                      });
                    }
                  }
                  
                  // 添加角色对应的新菜单
                  this.insert(1,this.createMenubar(buttons,menus));

                  var tb        = Ext.getCmp('main_toolbar');
                    loginBtn    = tb.getComponent('menu_login_btn');
                    investorLbl = tb.getComponent('menu_admin_lbl');
                    logoutBtn   = tb.getComponent('menu_logout_btn');

                  if(!Ext.isEmpty(lbl,false)){
                    lbl = Ext.String.format(lbl, userRole, loginName);
                    investorLbl.setText(lbl);
                    loginBtn.hide();
                    investorLbl.show();
                    logoutBtn.show();
                  }
                }
              }
            });

            if(!Ext.isEmpty(lbl,false)){
              lbl = Ext.String.format(lbl, userRole, loginName);
              Ext.defer(function(){
                Ext.create('Ninja.window.NotificationWindow', { html: lbl }).show(); 
              },1000);
            }
            
          }
        }
      }
    });
  }

});


