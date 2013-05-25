Ext.define('Ninja.grid.InvestorsGroupGrid',{
  extend:'Ext.grid.Panel',
  itemId:'investorsGroup',
  title:'投资者组',
  border:0,
  columnLines:true,
  split:true,
  initComponent: function(){
    var me  = this,
   
    store   = me.createStore(),
    columns = me.createColumns(),
    tbar    = me.createTbar(),
    bbar    = me.createBbar(store);
    
    Ext.apply(me, {
      columns: columns,
      store: store,
      tbar: tbar,
      bbar:bbar
    }); 
    me.callParent(arguments); 
  },

  createColumns: function(){
    var columns = {
      defaults:{
        sortable: true,
        align: "center"
      },
      items:[
        { xtype:'rownumberer',width: 30,sortable: false},
        {text:'组名', dataIndex:'name', width:120},
        {text:'短信通知号码', dataIndex:'notification_nums', flex:1},
        {text:'客服号码', dataIndex:'service_num',width:130},
        {text:'成员数量', dataIndex:'member_count', width:80}
      ]};
    return columns;
  },
  
  
  // 创建 数据源
  createStore: function(){
    var me = this;
    me.store = Ext.create('Ext.data.Store', {
      pageSize: 25,
      fields:[
        {name: 'id'},
        {name: 'name'},
        {name: 'notification_nums'},
        {name: 'service_num'},
        {name: 'member_count'}
      ],
      autoLoad: false,
      proxy: {
        url: '/groups.json',
        type: 'ajax',
        reader: {
          type: 'json',
          root: 'records'
        }
      },
      listeners: {
        beforeLoad: function(ds){
          ds.removeAll(false);
        }
      }
    });
    return me.store;
  },

  createTbar:function(){
    var me = this;
    var tbar = Ext.create('Ext.toolbar.Toolbar',{
      items:[
        {
          text:'创建',
          handler:function(){
            me.operationGroupWindow("create");
          }
        },
        {
          text:'修改',
          handler:function(){
            me.operationGroupWindow("update");
          }
        },
        {
          text:'删除',
          handler:function(){
            var sm = me.getSelectionModel().getSelection()[0];
            var id = sm.get('id');
            var name = sm.get('name');
            me.destroyGroup(id,name);
          }
        }
      ]
    });
    return tbar;
  },

  createBbar:function(store){
    var bbar = Ext.create('Ext.toolbar.Paging', {
      store: store,
      displayInfo: true
    });
    return bbar;
  },

  createFormPanel:function(){
    var me = this;
    me.formPanel = Ext.create('Ext.form.Panel',{
      frame:true,
      border:0,
      items:[
        {
          xtype:'textfield',
          itemId:'groupName',
          name:'group[name]',
          padding:'20 0 10 0',
          labelAlign:'right',
          fieldLabel:'组名称',
          anchor:'90%',
          allowBlank:false,
          blankText:'组名称不能为空'
        },
        {
          xtype:'textfield',
          itemId:'serviceNum',
          name:'group[service_num]',
          hideTrigger:'true',
          padding:'20 0 10 0',
          labelAlign:'right',
          fieldLabel:'客服号码',
          anchor:'90%',
          allowBlank:false,
          blankText:'客服号码不能为空',
          regex:/\d{3}-\d{8}|\d{4}-\d{7}/,
          regexText:'客服电话为: 区号+电话号码'
        },
        {
          xtype:'textarea',
          itemId:'notificationNums',
          name:'group[notification_nums]',
          labelAlign:'right',
          fieldLabel:'短信通知号码',
          anchor:'90%',
          allowBlank:false,
          blankText:'短信通知号码不能为空',
          regex:/^\d{11}(\s*[,，]\s*\d{11})*$/,
          regexText:'手机号码必须为数字！多个号码之前以,分隔'
        }
      ]
    });
    return me.formPanel;
  },

  operationGroupWindow:function(token){
    var me = this;    
    var buttons = [
      {
        text:'确定',
        scale:'medium',
        handler:function(){
          var form = me.formPanel.getForm();
          if(form.isValid()){
            var url,method,success_msg,fail_msg;
            if(token == "create"){
              url = '/groups.json';
              method = 'POST';
              success_msg = "创建成功";
              fail_msg = "创建失败";
            }else{
              var sm = me.getSelectionModel().getSelection()[0];
              var id = sm.get('id');
              url = '/groups/' + id + '.json';
              method = 'PUT';
              success_msg = "修改成功";
              fail_msg = "修改失败";
            }
            me.groupWindow.close();
            form.submit({
              clientValidation:true,
              method:method,
              url:url,
              success: function(form, action) {
                me.getStore().load(function(records){
                  var record;
                  if(token == "create"){
                    record = records.length - 1;
                  }else{
                    record = sm.index;
                  }
                  me.getSelectionModel().select(record);

                });
                Ext.create('Ninja.window.NotificationWindow', {
                  html:success_msg
                }).show();
              },
              failure: function(form, action) {
                me.groupWindow.close();
                Ext.create('Ninja.window.NotificationWindow', {
                  html:fail_msg,
                  iconCls:'ux-notification-icon-error'
                }).show();
              }
            });
          }
        }
      },
      {
        text:'取消',
        scale:'medium',
        handler:function(){
          me.groupWindow.close();
        }
      }
    ];
    me.createFormPanel();
    var title;
    if(token == "create"){
      title = "创建投资者组";
    }else{
      title = "修改投资者组";
      var record = me.getSelectionModel().getSelection()[0];
      me.formPanel.down("#groupName").setValue(record.get('name'));
      me.formPanel.down("#serviceNum").setValue(record.get('service_num'));
      me.formPanel.down("#notificationNums").setValue(record.get('notification_nums'));
    }
    me.groupWindow = Ext.create('Ext.window.Window',{
      title:title,
      closeAction:'hide',
      resizable:false,
      draggable:true,
      modal:true,
      width:400,
      height:260,
      border:0,
      layout:'fit',
      buttons:buttons,
      items:[me.formPanel]
    });
    me.groupWindow.show();
  },

  destroyGroup:function(id, name){
    var me = this;
    Ext.Msg.confirm('提示', '确定删除名称为“' + name + '”的组吗？', function(btn){
      if (btn == 'yes'){
        Ext.Ajax.request({
          url: '/groups/' + id + ".json",
          method: 'DELETE',
          success: function(response){
            var text = Ext.JSON.decode(response.responseText);
            if(text && text != "") {
              if(text.success){
                me.getStore().load();
                Ext.create('Ninja.window.NotificationWindow', {
                  html:"删除成功",
                }).show();
              }else{
                Ext.create('Ninja.window.NotificationWindow', {
                  html: text.msg,
                  iconCls:'ux-notification-icon-error'
                }).show();
              }
            }else{
              Ext.create('Ninja.window.NotificationWindow', {
                html:'你删除的数据不存在,请确认后再操作',
                iconCls:'ux-notification-icon-error'
              }).show();
            }
          }
        });
      }
    });
  }

});