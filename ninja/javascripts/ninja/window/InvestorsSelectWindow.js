Ext.define('Ninja.window.InvestorsSelectWindow',{
  extend:'Ext.window.Window',
  title:'选择投资者',
  closeAction:'hide',
  resizable:false,
  draggable:true,
  modal:true,
  width:600,
  height:370,
  border:0,
  layout:'border',
  initComponent:function(){
    var me = this;
    me.investorsSelector = Ext.create('Ninja.grid.InvestorsSelector',{
      region:'west',
      width:260,
      listeners:{
        afterrender:function(cmp){
          var investorsGroup = Ext.ComponentQuery.query("#investorsGroup")[0];
          var group = investorsGroup.getSelectionModel().getSelection()[0];
          var store = cmp.getStore();
          store.getProxy().extraParams['group_id'] = group.get('id');
          store.load();
        }
      }
    });
    var buttons = Ext.create('Ext.form.Panel',{
      //frame:true,
      bodyStyle: 'background-color:#dfe8f5;',
      region:'center',
      border:0,
      width:100,
      height:600,
      layout:{
        type: 'hbox',
        align: 'stretch'
      },
      items:[
        {
          xtype:'container',
          layout:{
            type:'vbox',
            align:'center',
            pack:'center'
          },
          items:[
            {
              xtype:'button',
              iconCls:'right_icon',
              width:60,
              scale:'medium',
              margin:'0 0 10 15',
              handler:function(){
                var records = me.investorsSelector.getSelectionModel().getSelection();
                var data = new Ext.util.HashMap();
                for(var i=0;i<records.length;i++){
                  var hash = {};
                  hash['id'] = records[i].get('id');
                  hash['login'] = records[i].get('login');
                  hash['name'] = records[i].get('name');
                  data.add(records[i].get('id'), hash);
                }
                var selectRecord = me.gridPanel.getStore().data.items;
                if(!Ext.isEmpty(selectRecord)){
                  for(var j=0;j<selectRecord.length;j++){
                    data.removeAtKey(selectRecord[j].get('id'));
                  }
                }
                var datas = [];
                data.each(function(key, value, length){
                  datas.push(value);
                });
                me.gridPanel.getStore().insert(0, datas);
              }
            },
            {
              xtype:'button',
              iconCls:'left_icon',
              width:60,
              scale:'medium',
              handler:function(){
                var records = me.gridPanel.getSelectionModel().getSelection();
                me.gridPanel.getStore().remove(records);
              }
            }
          ]
        }
      ]
    });
    var store = Ext.create('Ext.data.Store',{
      fields:[{name:'login'},{name:'name'}],
    });
    //var sm = Ext.create('Ext.selection.CheckboxModel');
    me.gridPanel = Ext.create('Ext.grid.Panel',{
      region:'east',
      width:250,
      height:600,
      multiSelect:true,
      columnLines:true,
      //selModel:sm,
      store:store,
      columns:[{header:"帐号",dataIndex:'login',flex:1,align:'center'},
               {header:"姓名",dataIndex:'name',flex:1,align:'center'}],
      tbar:["->", {xtype:'label', itemId:'count', text:'共0个用户', height:21, padding:'4 0 0 0'}]
    });
    store.on('datachanged', function(st){
      me.down("#count").setText("共"+st.getCount()+"个用户");
      if(st.getCount() == 0){
        sm.deselectAll(false);
      }
    });
    me.items = [me.investorsSelector, buttons, me.gridPanel];
    me.buttons = me.createButtons();
    me.callParent(arguments);
  },


  createButtons:function(){
    var me = this;
    var buttons = [
      {
        text:'确定',
        handler:function(){
          var investorsGroup = Ext.ComponentQuery.query("#investorsGroup")[0];
          var groupRecord = investorsGroup.getSelectionModel().getSelection()[0];
          me.addGroupMembers(groupRecord.get('id'));
        }
      },
      {
        text:'取消',
        handler:function(){
          me.close();
        }
      }
    ];
    return buttons;
  },

  addGroupMembers:function(group_id){
    var me = this;
    var records = me.gridPanel.getStore().data.items;
    var investor_ids = [];
    for(var i=0;i<records.length;i++){
      investor_ids.push(records[i].get('id'));
    }
    if(investor_ids.length <= 0){
      Ext.Msg.alert("提示","请选择投资者");
      return;
    }
    Ext.Ajax.request({
      url:'/groups/join_in.json',
      method:'POST',
      params:{
        'group_id'     : group_id,
        'investor_ids' : Ext.encode(investor_ids)
      },
      success:function(response){
        var text = Ext.JSON.decode(response.responseText);
        if(text && text != "") {
          if(text.success){
            me.close();
            var investorsGroup = Ext.ComponentQuery.query("#investorsGroup")[0];
            var groupStore = investorsGroup.getStore();
            var record = investorsGroup.getSelectionModel().getSelection()[0];
            groupStore.load(function(){
              investorsGroup.getSelectionModel().select(record.index);
            });
            Ext.create('Ninja.window.NotificationWindow', {
              html:"添加成功"
            }).show();
          }else{
            Ext.create('Ninja.window.NotificationWindow', {
              html:"添加失败",
              iconCls:'ux-notification-icon-error'
            }).show();
          }
        }else{
          Ext.create('Ninja.window.NotificationWindow', {
            html:'添加失败',
            iconCls:'ux-notification-icon-error'
          }).show();
        }
      }
    });
  }

});