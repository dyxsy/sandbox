Ext.define('Ninja.window.LoginDialog', {
  extend: 'Ext.window.Window',
  mixins: {
    sessionStateful: 'Ninja.util.SessionStateful'
  },
  iconCls: 'form-login-icon-title',
  constrainHeader: true,
  width: 380,
  height: 260,
  x:850,
  y:140,
  modal: false,
  resizable: false,
  draggable: false,
  closable: false,
  closeAction: 'hide',
  buttonAlign: 'center',
  layout: 'border',
  title: '登录',
  rememberLoginField: true,

  messages: undefined,
  qtips: undefined,
  headerPanel: undefined,
  formPanel: undefined,
  loginField: undefined,
  passwordField: undefined,
  rememberMeField: undefined,
  rememberLoginField: false,
  loginBtn: undefined,
  cancelBtn: undefined,

  initComponent: function(){
    var me = this;
    me.messages = me.messages || {};
    Ext.applyIf(me.messages, {
      wait: '登录中，请稍后...',
      waitTitle: '登录',
      loginfailed: '登录失败:',
      header: '请输入您的帐号和密码.'
    })

    me.qtips = me.qtips || {};
    Ext.applyIf(me.qtips, {
      rememberme: '不建议在共用电脑上选中。',
      capslockwarning: '<div class="form-login-warning">大写锁定</div><br />' +
      '<div>有大写锁定，可能会导致您输入的密码不正确。</div><br />' +
      '<div>你应该按大写锁定，输入密码之前把它关闭。</div>'
    });

    me.items = [
      me.createHeaderPanel(),
      me.createFormPanel()
    ];
    me.buttons = me.createButtons();

    me.on('beforehide', function(){
      me.formPanel.getForm().reset();
    });

    me.callParent(arguments);
    me.addEvents('success', 'failure');
  },

  // 创建信息说明控件
  createHeaderPanel: function(){
    var me = this;
    me.headerPanel = Ext.create('Ext.Component', {
      region: 'north',
      border: false,
      cls: 'form-login-header',
      height: 35
    });
    return me.headerPanel;
  },

  // 创建表单
  createFormPanel: function(){
    var me = this;

    // 帐号
    me.loginField = Ext.create('Ext.form.field.Text', {
      name: 'authentication[login]',
      fieldLabel: '帐号',
      msgTarget: 'side', 
      blankText: '帐号不能为空',
      labelWidth: 45,
      padding: '10 0 10 0',
      allowBlank: false,
      minLength: 3,
      maxLength: 30,
      anchor: '100%',
      listeners: {
        specialkey: function(field, e){
          if (e.getKey() == e.ENTER) {
            me.passwordField.focus();
          }
        }
      }
    });

    // 密码
    me.passwordField = Ext.create('Ext.form.field.Text', {
      name: 'authentication[password]',
      fieldLabel: '密码',
      msgTarget: 'side',
      inputType: 'password',
      blankText: '密码不能为空',
      anchor: '100%',
      enableKeyEvents: true,
      allowBlank: false,
      minLength: 1,
      maxLength: 30,
      labelWidth: 45,
      padding: '10 0 10 0',
      listeners: {
        render: { 
          fn: function(field) {
            field.capsWarningTooltip = Ext.create('Ext.tip.ToolTip', {
              target: field.bodyEl,
              anchor: 'top',
              disabled: true,
              html: this.qtips.capslockwarning
            });
          },
          scope: me
        },

        keypress: {
          fn: function(field, e) {
            var charCode = e.getCharCode(),
              tip = field.capsWarningTooltip;
            // a = 97, z = 122; A = 65, Z = 90
            if((e.shiftKey && charCode >= 97 && charCode <= 122) || (!e.shiftKey && charCode >= 65 && charCode <= 90)) {
              tip.enable();
              tip.show();
            }
            else {
              if(tip.hidden === false) {
                tip.disable();
                tip.hide();
              }
            }
          },
          scope: me
        },

        specialkey: {
          fn: function(field, e) {
            if(e.getKey() == e.ENTER ){
              me.captchaField.focus();
            }
          },
          scope: me
        },

        blur: function(field) {
          if(field.capsWarningTooltip.hidden === false) {
            field.capsWarningTooltip.hide();
          }
        }

      }
    });
    
    // 验证码图片
    me.captchaImage = Ext.create('Ext.Img',{width: 80,height:25 ,margin : '1 0 0 0' });
    
    // 验证码
    me.captchaField = Ext.create('Ext.form.field.Text', {
      name: 'captcha',
      fieldLabel: '验证码',
      labelWidth: 45,
      msgTarget: 'side',
      allowBlank: false,
      blankText: '验证码不能为空',
      minLength: 4,
      maxLength: 30,
      width:185,
      listeners: {
        specialkey: function(field, e){
          if (e.getKey() == e.ENTER) {
            me.loginBtn.focus();
          }
        }
      }
    });
    
    // 换一张
    me.captchaLabel = Ext.create('Ext.form.Label', {
      text: '看不清换一张',
      cls: 'my_label',
      itemId: 'captchaLabel',
      padding: '4 0 0 0',
      listeners : {
        render: function(c){
          c.getEl().on({
            click: function(el){
              me.updateImage(me.captchaImage);
            },
            scope: c
          });
        }
      }
    });

    // 记住帐号
    me.rememberMeField = Ext.create('Ext.form.field.Checkbox', {
      name: 'authentication[remember_me]',
      padding: '10 0 0 50',
      boxLabel: '&nbsp;记住帐号',
      listeners: {
        render: {
          scope: me,
          fn: function(field) {
            Ext.create('Ext.tip.ToolTip', {
              target: field.bodyEl,
              anchor: 'top',
              html: this.qtips.rememberme
            });
          }
        }
      }
    });

    // 表单控件
    me.formPanel = Ext.create('Ext.form.Panel', {
      region: 'center',
      bodyPadding: 5,
      header: false,
      border: false,
      bodyCls: 'framed-bgcolor',
      items: [
        me.loginField,
        me.passwordField,
        { xtype: 'fieldcontainer',
          layout: 'hbox',
          defaultType: 'textfield',
          fieldDefaults: {
            labelAlign: 'left',
            labelWidth: 45,
          },
          items: [
            me.captchaField,
            { xtype: 'splitter',width: 8}, 
            me.captchaImage,
            { xtype: 'splitter',width: 8},
            me.captchaLabel
          ]
        },me.rememberMeField
      ]
    });
    return me.formPanel;
  },

  // 创建按钮
  createButtons: function(){
    var me = this;
    me.loginBtn = Ext.create('Ext.button.Button', {
      xtype: 'button',
      text: '登&nbsp;&nbsp;录',
      scale: 'medium',
      width: 80,
      margin: '0 10 0 0',
      iconCls: 'form-login-icon-login',
      handler: me.submitFn,
      scope: me
    });
    me.cancelBtn = Ext.create('Ext.button.Button', {
      xtype: 'button',
      text: '重&nbsp;&nbsp;置',
      scale: 'medium',
      width: 80,
      margin: '0 0 0 10',
      iconCls: 'form-login-icon-cancel',
      handler: me.cancelFn,
      scope: me
    });
    me.forgotPasswordBtn = Ext.create('Ext.button.Button', {
      xtype: 'button',
      text: '忘记密码？',
      scale: 'medium',
      width: 80,
      margin: '0 5 0 10',
      handler: function(){
        var forgotPasswordWin = Ext.create('Ninja.window.ForgotPassword',{login:me.loginField.getValue() }).show();
      }
    });
    return [ me.loginBtn, me.cancelBtn ];
  },

  onShow: function(){
    var me = this;
    me.callParent(arguments);
    //me.center();
    me.setMessage(me.messages.header);
    me.updateImage(me.captchaImage);
    var login = Ext.util.Cookies.get('login');
      rememberMe = Ext.util.Cookies.get('rememberMe');
    if(login){
      me.loginField.setValue(login);
      me.rememberMeField.setValue(rememberMe);
    }
    me.loginField.focus(true, 1000);
    me.rememberMeField.focus(true,300);
  },

  // 取消函数
  cancelFn: function(){
    this.formPanel.getForm().reset();
    //this.hide();
  },

  // 提交函数
  submitFn: function(){
    var me = this,
      url = me.url,
      form = me.formPanel.getForm();
    if(form.isValid()){
      form.submit({
        url: "/login.json",
        method: 'POST',
        waitTitle: me.messages.waitTitle,
        waitMsg: me.messages.wait,
        success: me.onSuccess,
        failure: me.onFailure,
        scope: me
      });
    }
  },

  onSuccess: function (form, action) {
    var me = this;
    
    // 记住用户名
    if(me.rememberLoginField){
      var loginValue = me.loginField.getValue(),
        rememberMeValue = me.rememberMeField.getValue(),
        path = '/',
        expires = new Date(new Date().getTime()+(1000*60*60*24*30)), //30 days
        domain = window.location.hostname;
      Ext.util.Cookies.set('rememberMe', rememberMeValue, expires);
      if(rememberMeValue){
        Ext.util.Cookies.set('login', loginValue, expires);
      }else{
        Ext.util.Cookies.clear('login',path);
      }
    }
    me.hide();
    var appConf = {websocketBaseURI: "ws://127.0.0.1:8880/"};
    Ninja.App.init(appConf);
    //me.onSessionOnline(action.result);
    document.getElementById('content').style.display='none';
  },
  onFailure: function(form, action) {
    var me = this,
    msg = me.messages.loginfailed;
    me.loginField.focus(true, 300);
    if(action.result.msg){
      msg = msg + action.result.msg;
    }
    me.setErrorMessage(msg);
    me.updateImage(me.captchaImage);
    
    me.fireEvent('failure', me, form, action);
  },

  updateImage: function(captchaImage){
    Ext.Ajax.request({
      url: '/captcha.json',
      method: 'GET',
      success: function(response){
        var text = response.responseText;
        if(text && text != "") {
          var resp = Ext.JSON.decode(text); 
          if(resp.success){
            captchaImage.setSrc(resp.captcha);
          }
        }
      }
    });
  },

  setMessage: function(msg) {
    this.headerPanel.update(msg);
  },

  setErrorMessage: function(msg) {
    this.headerPanel.update('<span class="error">' + (msg || '') + '</span>');
  }/*,

  onSessionOnline: function(resp){
    var  msg = resp.login + " 您已登录系统。";
    var tb        = Ext.getCmp('main_toolbar'),
      adminLbl = tb.getComponent('menu_admin_lbl'),
      loginBtn   = tb.getComponent('menu_login_btn');
      logoutBtn   = tb.getComponent('menu_logout_btn');
    adminLbl.setText(msg);
    adminLbl.show();
    logoutBtn.show();
    loginBtn.hide();
    Ext.create('Ninja.window.NotificationWindow', { html: msg }).show();
  }*/

});