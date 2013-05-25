// 角色列表
Ext.define("Ninja.grid.RolesGrid",{
  extend :"Ext.grid.Panel",
  title: "角色管理",
  itemId:"grid",
  columnLines: true,

  initComponent:function() {
    var me = this,
      plugins = me.createRowEditing(),
      store = me.createStore(),
      columns = me.createColumns(),
      tbar = me.createTbar(store),
      bbar = me.createBbar(store);

    Ext.apply(me, {
      columns: columns,
      plugins: plugins,
      store: store,
      tbar: tbar,
      bbar: bbar
    });

    me.callParent(arguments);
    me.on('selectionchange', function(view, records){
      if(this.addclick == 1){
        this.addclick = 0;
      }else{
        this.down('#remove').setDisabled(!records.length);
        this.down('#edit').setDisabled(!records.length);
      }
    }, me);

  },

  /*
   * 创建列
   */
  createColumns: function(){
    var columns = [{
      header: '名称',
      sortable: true,
      dataIndex: 'label',
      width: 120,
      editor: {
        xtype: 'textfield',
        allowBlank: false,
        blankText: "名称不能为空"
      }
    },{
      header: '描述',
      sortable: true,
      dataIndex: 'description',
      flex: 1,
      editor: {
        xtype: 'textfield'
      }
    }];

    return columns;
  },

  /*
  *  创建数据源
  */
  createStore:function(){
    
    var store = Ext.create('Ext.data.Store', {
      fields:['name','description','id','label'],
      autoLoad: false,
      pageSize: 10,
      autoDestroy: true,
      proxy: {
        type: 'ajax',
        url: '/roles.json',
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
    return store;
  },

  /*
  *  创建可编辑的行
  */
  createRowEditing:function(){
    var me = this;
    me.rowEditing = Ext.create('Ext.ux.grid.RowEditing', {
      errorSummary :false,
      clicksToMoveEditor: 2,
      autoCancel: false,
      listeners:{
        edit:function(){
          var sm = me.getSelectionModel();
          var role = sm.getSelection()[0];
          var id = role.get("id");
          if(id && id != "") { 
            me.updateRemoteRole(role, me.getStore());
          } else { 
            me.createRemoteRole(role, me.getStore());
          }
        },
        beforeedit:function(){
          me.down('#remove').setDisabled(true);
        },
        canceledit:function(){
          me.down('#add').setDisabled(false);
          me.down('#remove').setDisabled(false);
        }
      }
    });
    return me.rowEditing;
  },

  /*
  *  创建顶部工具栏
  */
  createTbar:function(store){
    me = this;
    var tbar = Ext.create('Ext.toolbar.Toolbar', {
      items: [{
        text:"添加",
        itemId: 'add',
        listeners:{
          click : function() {
            me.addclick = 1;
            if (me.rowEditing.editing) return false;
            var roles = {
              label:'输入角色名称'
            };
          me.rowEditing.startAdd(roles, 0);
          }
        }
      },{
        text: "修改",
        itemId: 'edit',
        handler:function(){
          var sm = me.getSelectionModel();
          var role = sm.getSelection()[0];
          me.rowEditing.startEdit(role, 0);
        },
        disabled: true
      },{
          text:"删除",
          itemId: 'remove',
          handler: function() {
            var sm = me.getSelectionModel();
            me.deleteRole(sm,store,me.rowEditing);
          },
          disabled: true
      }]
    });
    return tbar;
  },

  /*
  *  创建底部工具栏
  */
  createBbar:function(store){
    var bbar = Ext.create('Ext.toolbar.Paging', {
      store: store,
      displayInfo: true
    });
    return bbar;
  },

  /*
  *  添加数据
  */
  createRemoteRole : function(role, store) {
    Ext.Ajax.request({
      url: '/roles',
      method: 'POST',
      params: {
        "role[label]": role.get("label"),
        "role[description]": role.get("description")
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

  /*
  *  修改更新数据
  */
  updateRemoteRole : function(role, store) {
    Ext.Ajax.request({
      url: '/roles/'+ role.get("id")+".json",
      method: 'PUT',
      params: {
        "role[label]": role.get("label"),
        "role[description]": role.get("description")
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

  /*
  *  删除数据
  */
  deleteRole:function(sm,store,rowEditing){
    var role = sm.getSelection()[0],
      label = role.get("label"),
      id = role.get("id");
   
    Ext.Msg.confirm('提示', '确定删除“' + label + '”角色？', function(btn){
      if (btn == 'yes'){
        Ext.Ajax.request({
          url: '/roles/'+id+".json",
          method: 'DELETE',
          success: function(response){
            var text = Ext.JSON.decode(response.responseText);
            if(text && text != "") {
              if(text.success) {
                rowEditing.cancelEdit();
                store.remove(sm.getSelection());
              } else{
                Ext.create('Ninja.window.NotificationWindow', {
                  html: text.msg,
                  iconCls: 'ux-notification-icon-error'
                }).show();
              }
            }else{
              Ext.create('Ninja.window.NotificationWindow', {
                html: '你删除的数据不存在,请确认后在操作',
                iconCls: 'ux-notification-icon-error'
              }).show();
            }
          }
        });
      }
    });
  }

});
