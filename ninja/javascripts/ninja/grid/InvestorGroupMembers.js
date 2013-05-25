Ext.define('Ninja.grid.InvestorGroupMembers',{
  extend:'Ext.grid.Panel',
  title:'组成员',
  itemId:'groupMembers',
  border:0,
  multiSelect:true,
  split:true,
  columnLines: true,
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
      bbar: bbar
    }); 
    me.callParent(arguments); 
    me.on('selectionchange',function(cmp, records){
      if(records.length > 0){
        me.down("#removeMembers").setDisabled(false);
      }else{
        me.down("#removeMembers").setDisabled(true);
      }
    });
  },

  createColumns: function(){
    var columns = {
      defaults:{
        sortable: true,
        align: "center"
      },
      items:[
        { xtype:'rownumberer',width: 30,sortable: false},
        {text:'帐号', dataIndex:'login', flex:1},
        {text:'姓名', dataIndex:'name', flex:1}
      ]};
    return columns;
  },
  
  
  // 创建 数据源
  createStore: function(){
    var me = this;
    me.store = Ext.create('Ext.data.Store', {
      pageSize: 25,
      fields:[
        {name: 'id'},{name: 'name'},{name: 'login'}
      ],
      autoLoad: false,
      proxy: {
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
          text:'添加',
          handler:function(){
            Ext.create('Ninja.window.InvestorsSelectWindow').show();
          }
        },
        {
          text:'删除',
          itemId:'removeMembers',
          disabled:true,
          handler:function(){
            me.deleteGroupMembers("delete");
          }
        },
        {
          text:'全部删除',
          handler:function(){
            me.deleteGroupMembers("destroyAll");
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

  deleteGroupMembers:function(flag){
    var me = this;
    var logins = [];
    var investor_ids = [];
    var investorsGroup = Ext.ComponentQuery.query("#investorsGroup")[0];
    var group = investorsGroup.getSelectionModel().getSelection()[0];
    var id = group.get('id');
    var name = group.get('name');
    var msg, params = {'group_id': id};
    if(flag == "delete"){
      var sm = me.getSelectionModel().getSelection();
      for(var i=0;i<sm.length;i++){
        logins.push(sm[i].get('login'));
        investor_ids.push(sm[i].get('id'));
      }
      params['investor_ids'] = Ext.encode(investor_ids);
      msg = "确定从“" + name + "”组删除(" + logins.toString() +")成员吗？"
    }else if(flag == "destroyAll"){
      params['destroy_all'] = true;
      msg = "确定从“" + name + "”组删除全部成员吗?"
    }
    Ext.Msg.confirm('提示', msg, function(btn){
      if (btn == 'yes'){
        Ext.Ajax.request({
          url: '/groups/leave.json',
          method: 'DELETE',
          params: params,
          success: function(response){
            var text = Ext.JSON.decode(response.responseText);
            if(text && text != "") {
              if(text.success){
                var investorsGroup = Ext.ComponentQuery.query("#investorsGroup")[0];
                var groupStore = investorsGroup.getStore();
                var record = investorsGroup.getSelectionModel().getSelection()[0];
                groupStore.load(function(){
                  investorsGroup.getSelectionModel().select(record.index);
                });
              }else{
                Ext.create('Ninja.window.NotificationWindow', {
                  html:"删除成功",
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