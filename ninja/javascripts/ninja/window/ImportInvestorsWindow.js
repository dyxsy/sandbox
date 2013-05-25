Ext.define('Ninja.window.ImportInvestorsWindow',{
  extend:'Ext.window.Window',
  closeAction:'hide',
  resizable:false,
  draggable:true,
  modal:true,
  width:1200,
  height:600,
  border:0,
  layout:'border',
  initComponent:function(){
    var me = this;
    var sm = Ext.create('Ext.selection.CheckboxModel');
    me.investorsGrid = Ext.create('Ninja.grid.InvestorsGrid',{
      region:'west',
      width:850,
      height:570,
      selModel:sm,
      multiSelect:true,
      listeners:{
        afterrender:function(cmp){
          var store = cmp.getStore();
          store.load();
          var tbar = Ext.create('Ext.toolbar.Toolbar',{
            items:[
              "->",
              Ext.create('Ext.ux.form.SearchField', {
                fieldLabel: '搜索',
                labelWidth: 35,
                width: 200,
                margin: '0 5 0 0',
                store:store,
                searchURL:'/investors/search.json'
              })
            ]
          });
          cmp.insertDocked(0,tbar);
        }
      }
    });
    var buttons = Ext.create('Ext.form.Panel',{
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
              margin:'0 0 10 20',
              handler:function(){
                var records = me.investorsGrid.getSelectionModel().getSelection();
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
    var sm = Ext.create('Ext.selection.CheckboxModel');
    me.gridPanel = Ext.create('Ext.grid.Panel',{
      region:'east',
      width:250,
      height:600,
      multiSelect:true,
      selModel:sm,
      store:store,
      columns:[{header:"帐号",dataIndex:'login',flex:1,align:'center'},
               {header:"姓名",dataIndex:'name',flex:1,align:'center'}],
      bbar:["->", {xtype:'label', itemId:'count', text:'共0个用户', height:21, padding:'4 0 0 0'}]
    });
    store.on('datachanged', function(st){
      me.down("#count").setText("共"+st.getCount()+"个用户");
      if(st.getCount() == 0){
        sm.deselectAll(false);
      }
    });
    me.items = [me.investorsGrid, buttons, me.gridPanel];
    me.buttons = me.createButtons();
    me.callParent(arguments);
  },

  createButtons:function(){
    var me = this;
    var buttons = [
      {
        text:'确定',
        scale:'medium',
        handler:function(){
          if(me.token == "investorsGroup"){ //投资者组
            var investorsGroup = Ext.ComponentQuery.query("#investorsGroup")[0];
            var groupRecord = investorsGroup.getSelectionModel().getSelection()[0];
            me.addGroupMembers(groupRecord.get('id'));
          }else{ //风控组
            var sm = Ext.ComponentQuery.query("#groupsGrid")[0].getSelectionModel().getSelection()[0];
            var records = me.gridPanel.getStore().data.items;
            var investor_ids = [];
            for(var i=0;i<records.length;i++){
              investor_ids.push(records[i].get('id'));
            }
            var hash = {};
            hash['gid'] = sm.get('id');
            hash['investors'] = investor_ids;
            var url = Ninja.App.socketBaseURI+"admins/"+1;
            var websocket = Ext.ex.WebSocketManager.get(url);
            websocket.send("interested_groups#join_in", [hash]);
            me.close();
          }
        }
      },
      {
        text:'取消',
        scale:'medium',
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
            var groupMembers = Ext.ComponentQuery.query("#groupMembers")[0];
            var store = groupMembers.getStore();
            store.getProxy().url = '/groups/' + group_id + '/group_members.json';
            store.load();
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