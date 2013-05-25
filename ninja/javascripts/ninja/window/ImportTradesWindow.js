Ext.define("Ninja.window.ImportTradesWindow",{
  extend: 'Ext.window.Window',

  title: '成交记录导入',
  resizable: false,
  border: false,
  layout: 'fit',
  width: 320,
  modal: true,

  initComponent: function(){
    var me = this;
    me.items = me.createForm();
    me.on('afterrender', function(cmp){
      cmp.center();
    });
    me.callParent(arguments);
  },

  createForm: function(){
    var me = this;
    var form = Ext.create('Ext.form.Panel', {
      frame: true,
      border: false,
      bodyPadding: '10 10 0',
      buttonAlign: 'center',
      
      defaults: {
        anchor: '100%',
        allowBlank: false,
        msgTarget: 'side',
        //labelAlign: 'top'
      },
      
      items: [{
        xtype: 'fieldcontainer',
        fieldLabel: '编码类型',
        labelWidth: 60, 
        defaultType: 'radio',
        layout: 'hbox',
        defaults: {flex: 1},
        items: [{
          checked: true,
          boxLabel: 'GBK',
          name: 'category',
          inputValue: "gbk"
        }, {
          xtype: 'splitter',
          width: 20
        }, {
          boxLabel: 'UTF8',
          name: 'category',
          inputValue: "utf8"
        }]
      },{
          xtype: 'splitter',
          width: 30
        },{
        xtype: 'filefield',
        emptyText: '请选择CSV文件',
        fieldLabel: '文件',
        labelWidth: 60,
        name: 'file',
        regex:/.*.csv$/,
        regexText: '请选择CSV文件',
        buttonText: '浏览'
      }],
      
      buttons: [{
        text: '上传并导入',
        handler: function(){
          var form = this.up('form').getForm();
          if(form.isValid()){
            form.submit({
              url: 'cfmmc.json',
              type: 'ajax',
              waitMsg: '导入中，请稍后...',
              success: function(f, act){
                Ext.create('Ninja.window.NotificationWindow', {
                  html: '导入成功!'
                }).show();
                me.close();
                me.tradeGrid.getStore().load();

              },
              failure: function(f, act) {
                var msg = '导入失败!';
                if(act.result.msg){
                  msg += act.result.msg;
                }
                Ext.create('Ninja.window.NotificationWindow', {
                  html: msg,
                  iconCls: 'ux-notification-icon-error'
                }).show();
                me.close();
              }
            });
          }
        }
      },{
        text: '重置',
        handler: function() {
          this.up('form').getForm().reset();
        }
      }]
    });
    return form;
  }


});

