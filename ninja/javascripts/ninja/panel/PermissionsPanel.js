Ext.define('Ninja.panel.PermissionsPanel',{
  extend: 'Ext.panel.Panel',
  border: false,
  layout: 'border',
  replace: function(config,myMask){
    var btns = Ext.getCmp('per_panel');
    btns.remove(0);
    btns.add(Ext.apply(config));
    myMask.hide();
  },
  initComponent: function() {
    this.items = [
      { id:'per_panel',
        region:'center',
        bodyCls: 'framed-bgcolor',
        minWidth: 200
      }, 
      this.createRolesGrid()
    ];
    this.callParent(arguments);
  },
  
  // 创建角色面板
  createRolesGrid:function(){
    var rolesGrid = Ext.create("Ninja.grid.RolesGrid",{
      region: 'west',
      width: 400,
      minWidth: 200,
      split: true,
      listeners: {
        itemclick: {
          fn: function(cmp, record){
            var rd = cmp.getSelectionModel().getLastSelected();
            if(!rd) return;
            var myMask = new Ext.LoadMask(this, {msg:"加载中..."});
            myMask.show();
            setTimeout( function(){myMask.hide();}, 800);
            this.loadPermissionsForm(record.get('name'),record.get('id'));
          },
          scope: this
        },
        afterrender: {
          fn: function(cmp){
            var store = cmp.getStore();
            store.on('load',function(sto,records){
              var record = records[0];
              if(!record) return;
              cmp.getSelectionModel().select(record,true);
              this.loadPermissionsForm(record.get('name'),record.get('id'));
            },this);
            store.load();
          },
          scope: this
        }
      }
    });
    return rolesGrid;
  },
  
  // 创建权限项面板
  createPermissionsForm:function(role_id,fields,permissions){
    var forms =  Ext.create('Ninja.form.PermissionsForm', {
      region: 'center',
      role_id: role_id,
      fields:fields,
      permissions:permissions
    });
    return forms;
  },
  
  // 加载权限项
  loadPermissionsForm:function(role_name,role_id){
    var me = this;
    Ext.Ajax.request({
      url : '/roles/show_permissions.json',
      method : 'GET',
      params: {
        role_id: role_id
      },
      success: function(response){
        var text = response.responseText;
        if(text && text !=""){
          var resp = Ext.JSON.decode(text),
            data = resp.data,
            permissions = resp.permissions;
          if(resp.success){
            var result = [];
            for(var i = 0; i<data.length; i++){
              var items = [];
              for(var j = 0; j<data[i].power_bits.length; j++){
                var temp =  data[i].power_bits[j];
                var item = { 
                  name: temp.action,
                  boxLabel: temp.text,
                  powerBit: temp.id,
                  padding: "0 110 0 0"
                };
                items.push(item);
              }
              result.push(me.createItems({items: items,group:data[i].group}));
            }
            var myMask = new Ext.LoadMask(me, {msg:"加载中..."});
            myMask.show();
            me.replace(me.createPermissionsForm(role_id,result,permissions),myMask);
            
          }
        }
      }
    });
  },
  
  // 创建权限项组建
  createItems:function(field){
    var item = { 
      xtype: 'fieldset',
      title: field.group,
      layout: 'anchor',
      items: [{
        xtype: 'fieldcontainer',
        layout: {
          type: 'table',
          columns: 6
        },
        defaultType: 'checkbox',
        //defaults: {flex: 1},
        items: field.items
      }]
    };
    return item;
  }
});