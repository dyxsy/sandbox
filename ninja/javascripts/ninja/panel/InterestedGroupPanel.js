Ext.define('Ninja.panel.InterestedGroupPanel',{
  extend:'Ext.panel.Panel',
  border:0,
  layout:'border',
  initComponent: function(){
    var me = this;
    var columns = {
      items:[
        {
          text: '用户组',  
          dataIndex:'name', 
          sortable: false,
          align: "center",
          flex:1,
          editor:{
            xtype:'textfield',
            allowBlank:false,
            blankText:'用户组名称不能为空',
            emptyText:'请输入组名称',
            selectOnFocus:true
          }
        },
        {
          text:'成员',
          dataIndex:'member_count',
          flex:1,
          align:"center"
        }
      ]
    };
    me.groupsGrid = Ext.create('Ninja.grid.InterestedGroupsGrid',{
      title:'用户组',
      flex:1,
      columns:columns,
      tbar:me.createGroupTbar(),
      plugins:me.createRowEditing(),
      datastoreUrl:'/interested_groups.json',
      bbar:["->", {xtype:'label', itemId:'countGroup', text:'共0个用户组', height:21, padding:'4 0 0 0'}],
      listeners:{
        afterrender:function(cmp){
          cmp.getStore().on('load', function(store, records){
            var record = records[0];
            if(!record) return;
            cmp.getSelectionModel().select(record);
            me.loadInvestorsByGroup(record.get('id'));
          });
        },
        itemclick:function(cmp, model){
          me.loadInvestorsByGroup(model.get('id'));
        },
        selectionchange:function(cmp, records){
          if(records.length == 0){
            me.down('#create').setDisabled(false);
            me.down('#update').setDisabled(true);
            me.down('#remove').setDisabled(true);
          }else{
            me.down('#update').setDisabled(false);
            me.down('#remove').setDisabled(false);
          }
        }
      }
    });
    me.groupsGrid.getStore().on('datachanged',function(st){
      me.groupsGrid.down("#countGroup").setText("共"+st.getCount()+"个用户组");
    });
    var sm = Ext.create('Ext.selection.CheckboxModel');
    me.investorsGrid = Ext.create('Ninja.grid.InvestorsGrid',{
      title:'投资者列表',
      region:'center',
      flex:5,
      selModel:sm,
      multiSelect:true,
      tbar:me.createInvestorTbar()
    });
    me.investorsGrid.on('selectionchange',function(cmp, records){
      if(records.length > 0){
        me.down("#remove_investor").setDisabled(false);
      }else{
        me.down("#remove_investor").setDisabled(true);
      }
    });
    me.items = [me.groupsGrid, me.investorsGrid];
    me.callParent(arguments);
  },

  createGroupTbar:function(){
    var me = this;
    var tbar = Ext.create('Ext.toolbar.Toolbar',{
      items:[
        {
          text:'创建',
          itemId:'create',
          handler:function(){
            if (me.rowEditing.editing) return false;
            me.rowEditing.startAdd('', 0);
          }
        },
        {
          text:'修改',
          itemId:'update',
          handler:function(){
            var sm = me.groupsGrid.getSelectionModel().getSelection()[0];
            me.rowEditing.startEdit(sm, 0);
          }
        },
        {
          text:'删除',
          itemId:'remove',
          handler:function(){
            /*var sm = me.groupsGrid.getSelectionModel();
            me.destroyGroup(sm);*/

            //websocket
            var sm = me.groupsGrid.getSelectionModel().getSelection()[0];
            var id = sm.get('id');
            var name = sm.get('name');
            Ext.Msg.confirm('提示', '确定删除名称为“' + name + '”的组吗？', function(btn){
              if (btn == 'yes'){
                me.groupsGrid.websocket.send("interested_groups#destroy", id);
                me.groupsGrid.getStore().load();
              }
            });
          }
        }
      ]
    });
    return tbar;
  },

  createRowEditing:function(){
    var me = this;
    me.rowEditing = Ext.create('Ext.ux.grid.RowEditing', {
      errorSummary :false,
      clicksToMoveEditor: 2,
      autoCancel: false,
      listeners:{
        edit:function(){
          var group = me.groupsGrid.getSelectionModel().getSelection()[0];
          var store = me.groupsGrid.getStore();
          var id = group.get("id");
          var data = {};
          data['name'] = group.get('name');
          if(!Ext.isEmpty(id,false)){
            //me.updateRemoteGroup(group, store);

            //websocket
            data['id'] = group.get('id');
            me.groupsGrid.websocket.send("interested_groups#update", data);
            me.groupsGrid.getStore().load();
          }else{
            //me.createRemoteGroup(group, store);

            //websocket
            me.groupsGrid.websocket.send('interested_groups#create', data);
            me.groupsGrid.getStore().load();
          }
        },
        beforeedit:function(){
          me.down('#create').setDisabled(true);
          me.down('#update').setDisabled(true);
          me.down('#remove').setDisabled(true);
        },
        canceledit:function(){
          me.down('#create').setDisabled(false);
          me.down('#update').setDisabled(false);
          me.down('#remove').setDisabled(false);
        }
      }
    });
    return me.rowEditing;
  },

  createInvestorTbar:function(){
    var me = this;
    var tbar = Ext.create('Ext.toolbar.Toolbar',{
      items:[
        {
          text:'添加',
          handler:function(){
            var addInvestorwindow = Ext.create('Ninja.window.ImportInvestorsWindow',{
              token:"interested_group"
            });
            var name = me.groupsGrid.getSelectionModel().getSelection()[0].get('name');
            addInvestorwindow.setTitle("添加用户到" + name + "组");
            addInvestorwindow.show();
          }
        },
        {
          text:'删除',
          itemId:'remove_investor',
          disabled:true,
          handler:function(){
            Ext.Msg.confirm('提示',"确定从该组中移除这些投资者吗?");

            //websocket
            var id = me.groupsGrid.getSelectionModel().getSelection()[0].get('id');
            var sm = me.investorsGrid.getSelectionModel().getSelection();
            var investor_ids = [];
            for(var i=0;i<sm.length;i++){
              investor_ids.push(sm[i].get('id'));
            }
            var hash = {};
            hash['gid'] = id;
            hash['investors'] = investor_ids;
            var data = [hash];
            //me.investorsGrid.getStore().send("groups#leave", data);
          }
        }
      ]
    });
    return tbar;
  },

  loadInvestorsByGroup:function(group_id){
    var me = this;
    var store = me.investorsGrid.getStore();
    store.getProxy().url = '/interested_groups/' + group_id + '/investors.json';
    store.load();
  },

  createRemoteGroup:function(group, store){
    Ext.Ajax.request({
      url:'/interested_groups.json',
      method:'POST',
      params: {
        "interested_group[name]": group.get("name")
      },
      success: function(response){
        var text = response.responseText;
        if(text && text !=""){
          var resp = Ext.JSON.decode(text);
          if(resp.success){
            store.load();
          } else{
            Ext.create('Ninja.window.NotificationWindow', {
              html: '数据错误',
              iconCls: 'ux-notification-icon-error'
            }).show();
          }
        }else{
          Ext.create('Ninja.window.NotificationWindow', {
            html: '数据错误',
            iconCls: 'ux-notification-icon-error'
          }).show();
        }
      }
    });
  },

  updateRemoteGroup:function(group, store){
    Ext.Ajax.request({
      url:'/interedted_groups/'+ group.get("id")+".json",
      method:'PUT',
      params:{
        "interested_group[name]": group.get("name")
      },
      success: function(response){
        var text = response.responseText;
        if(text && text != "") {
          var resp = Ext.JSON.decode(text); 
          if(resp.success) {
            store.load();
          } else {
            Ext.create('Ninja.window.NotificationWindow', {
              html: '更新数据不存在',
              iconCls: 'ux-notification-icon-error'
            }).show();
          } 
        }else{
          Ext.create('Ninja.window.NotificationWindow', {
            html: '更新数据不存在',
            iconCls: 'ux-notification-icon-error'
          }).show();
        }
      }
    });
  },

  destroyGroup:function(sm){
    var me = this;
    var id = sm.getSelection()[0].get("id");
    var name = sm.getSelection()[0].get("name");
    Ext.Msg.confirm('提示', '确定删除名称为“' + name + '”的组吗？', function(btn){
      if (btn == 'yes'){
        Ext.Ajax.request({
          url: '/interested_groups/'+id+".json",
          method: 'DELETE',
          success: function(response){
            var text = Ext.JSON.decode(response.responseText);
            if(text && text != "") {
              if(text.success){
                me.groupsGrid.getStore().remove(sm.getSelection());
              }else{
                Ext.create('Ninja.window.NotificationWindow', {
                  html:text.msg,
                  iconCls: 'ux-notification-icon-error'
                }).show();
              }
            }else{
              Ext.create('Ninja.window.NotificationWindow', {
                html:'你删除的数据不存在,请确认后在操作',
                iconCls:'ux-notification-icon-error'
              }).show();
            }
          }
        });
      }
    });
  }

});