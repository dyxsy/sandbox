Ext.define('Ninja.panel.MenuManagement',{
  extend: 'Ext.panel.Panel',
  border: false,
  layout: 'border',
  
  replace: function(config){
    var btns = Ext.getCmp('per_panel');
    btns.remove(0);
    btns.add(Ext.apply(config));
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
            this.loadMenuManagementForm(record.get('id'));
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
              this.loadMenuManagementForm(record.get('id'));
            },this);
            store.load();
          },
          scope: this
        }
      }
    });
    return rolesGrid;
  },
  // 创建菜单项面板
  createMenuManagementForm:function(role_id,root){
    var forms =  Ext.create('Ninja.form.MenuManagementForm', {
      region: 'center',
      role_id: role_id,
      root:root
    });
    return forms;
  },
  
  // 加载菜单项
  loadMenuManagementForm:function(role_id){
    var me = this;
    Ext.Ajax.request({
		  url : '/roles/show_menus.json',
      method : 'GET',
      params: {
        role_id: role_id
      },
		  success: function(response){
        // 处理获得的菜单数据 
        var text = response.responseText;
        if(text && text !=""){
          var resp = Ext.JSON.decode(text);
          if(resp.success){
            var menus_text = resp.menus_text,
            root = resp.data,
            children = root.children;
            var result = {};
            for(var i  = 0; i< children.length; i++){
              var children2 = children[i].children;
              if(children[i].children.length == 0){
                children[i].checked  = false;
                children[i].leaf     = true;
                result[[children[i].text]] = children[i];
              }else{
                for(var j  = 0; j< children2.length; j++){
                  children2[j].leaf    = true;
                  children2[j].checked = false;
                  result[[children2[j].label]] = children2[j];
                }
              }
            }

            for(var i = 0; i < menus_text.length; i++){
                if(result[menus_text[i]]){
                  result[menus_text[i]].checked = true;
                }
              }
              children.children = result;
            me.replace(me.createMenuManagementForm(role_id,root));
          }
        }
        
      }
		});
  }
});
