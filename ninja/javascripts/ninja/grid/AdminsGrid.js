//柜员详情列表
Ext.define('Ninja.grid.AdminsGrid', {
	extend:'Ext.grid.Panel',
	columnLines:true,
	enableColumnMove:false,
	enableColumnHide:false,
	viewConfig: {
		stripeRows:true
	},
	initComponent: function(){

		var store  = this.createStore();
		Ext.apply(this,{
			columns: this.createColumns(),
			store: store,
			bbar: this.createBbar(store),
			tbar: this.createTbar(store)
		});
		this.callParent(arguments);
	},
	listeners:{
		afterrender: function(){
			var ds = this.getStore();
	  	ds.load();
		},
    selectionchange: function(cmp, records){
      var me = this;
      if(records.length > 0){
        me.down("#setRole").setDisabled(false);
      }else{
        me.down("#setRole").setDisabled(true);
      }
    }
	},
	//创建表格列
	createColumns: function(){
		var columns = {
			defaults:{
				sortable: true,
				align: "center"
			},
			items:[
				{ xtype: 'rownumberer',width: 30,sortable: false},
				{text: '帐号',  dataIndex:'login', flex:1},
				{text: '姓名',  dataIndex:'name', flex:1},
				{text: '角色',  dataIndex:'user_role',flex:1},  
				{text: '备注',  dataIndex:'comment',flex:1}
			]};
		return columns;
	},

	//创建数据源
	createStore: function(){
		var me = this;
		me.store = Ext.create('Ext.data.Store',{
			fields:[
				{name: 'login'},
				{name: 'name'},
				{name: 'user_role'},
				{name: 'comment'}
			],
			autoLoad: false,
			remoteSort: false,
			pageSize: 25,
			proxy: {
				url: '/admins.json',
				type: 'ajax',
				reader: {
					type: 'json',
					root: 'records'
				},
				simpleSortMode: true
			},
			listeners: {
				beforeLoad: function(store){
					store.removeAll(false);
				}
			}
		});
		return me.store;
	},
	// 创建底部工具栏
	createBbar: function(store){
		var bbar = Ext.create('Ext.toolbar.Paging',{
			store: store,
			displayInfo: true
		});
		return bbar;
	},
	//创建顶部工具栏
	createTbar: function(store){
		var me = this;
		var tbar = Ext.create('Ext.toolbar.Toolbar',{
			items: [
				{
	        text:'配置角色',
	        itemId:'setRole',
	        disabled:true,
	        handler:function(){
	          me.createRoleWindow();
	        }
	      },
	      "->",
				Ext.create('Ext.ux.form.SearchField',{
					fieldLabel: '搜索',
					labelWidth: 35,
					width: 200,
					margin: '0 5 0 0',
					store: store,
					searchURL:'/admins/search.json'
				})]
		});
		return tbar;
	},

	createRoleWindow:function(){
    var me = this;
    var buttons = [
      {
        text:'确定',
        handler:function(){
          var role_id = me.formPanel.down("#role").getValue();
          var sm = me.getSelectionModel().getSelection();
          me.updateRole(sm, role_id);
        }
      },
      {
        text:'取消',
        handler:function(){
          me.roleWindonw.close();
        }
      }
    ];
    me.roleWindonw = Ext.create('Ext.window.Window',{
      resizable: false,
      closeAction: 'hide',
      height: 150,
      width: 300,
      title: "配置角色",
      border: 0,
      modal: true,
      layout: 'fit',
      buttons: buttons,
      items: [me.createForm()]
    });
    me.roleWindonw.show();
  },

  createForm:function(){
    var me = this;
    me.formPanel = Ext.create('Ext.form.Panel',{
      frame:true,
      border:0,
      items:[me.createCombo()]
    });
    return me.formPanel;
  },

  createCombo: function(){
    var store = Ext.create('Ext.data.Store', {
      fields: ['id', 'display'],
      autoLoad: true,
      proxy: {
        type: 'ajax',
        url: 'roles/show_roles',
        reader: {
          type: 'json',
          root: 'records',
        }
      },
      listeners: {
        beforeLoad: function(store){
          store.removeAll(false);
          comboBox.clearValue();
        },
        load: function(store,records, success){
          comboBox.setLoading(false);
          if(!success){
            return;
          }
          var first = records[0];
          if(first){
            comboBox.setValue(first.get("id"));
          }  
        }
      }
    });
    var comboBox = Ext.create('Ext.form.field.ComboBox', {
      itemId:'role',
      fieldLabel: '请选择角色',
      defaultListConfig: {
        loadMask: false
      },
      displayField: 'display',
      valueField: 'id',
      width: 250,
      labelWidth: 80,
      store: store,
      queryMode: 'local',
      typeAhead: false,
      editable: false,
      margin:'20 0 0 0'
    });
    return comboBox;
  },

  updateRole:function(sm, role_id){
    var me = this;
    var admin_ids = [];
    for(var i=0;i<sm.length;i++){
      admin_ids.push(sm[i].get('id'));
    }
    Ext.Ajax.request({
      url:'/admins/' + admin_ids.toString() + '.json',
      method:'PUT',
      params:{
        'role_id' : role_id
      },
      success:function(response){
        var text = response.responseText;
        if(text && text != "") {
          var resp = Ext.JSON.decode(text); 
          if(resp.success){
            me.roleWindonw.close();
            me.getStore().load();
            Ext.create('Ninja.window.NotificationWindow', {
              html:'设置角色成功!'
            }).show();
          }
        }
      }
    });
  }

});