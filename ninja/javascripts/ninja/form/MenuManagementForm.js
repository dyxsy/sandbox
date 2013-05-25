Ext.define('Ninja.form.MenuManagementForm', {
  extend: 'Ext.form.Panel',
  buttonAlign: 'left',
  title: '菜单选项',
  bodyCls: 'framed-bgcolor',
  border: false,
  layout:'fit',
  //margin: '0 0 0 30',
  itemId: 'menuManagementForm',
  initComponent: function() {
    var me = this;
    me.buttons = me.createButton(me.role_id);
    me.items = [me.createTree(this.root)]
    me.callParent(arguments);
  },

  // 创建提交按钮
  createButton: function(role_id){
    var btn = [{
      text:'保存',
      handler: function(){
        var checked = this.tree.getChecked();
        var menus_id = [];
        for(var i = 0; i< checked.length;i++){
          menus_id.push(parseInt(checked[i].data.id));
          
        }
        var form = this.getForm();
        form.submit({
          url: '/roles/add_menus.json',
          params: {
            role_id: role_id,
            menus_id: Ext.encode(menus_id)
          },
          method: 'POST',
          waitTitle: '保存',
          waitMsg: '保存中，请稍后...',
          success: function(){
            Ext.create('Ninja.window.NotificationWindow', {
              html: '保存成功'
            }).show();
          },
          failure: function(response, result){
            Ext.create('Ninja.window.NotificationWindow', {
              html: '保存失败'+result.result.msg
            }).show();
          }
        });
      },scope: this
    }];
    return btn;
  },

  createTree: function(root){
    var height = window.innerHeight * 0.6;
    this.tree = Ext.create('Ext.tree.Panel', {
      root: root,
      rootVisible: false,
      useArrows: true,
      bodyCls: 'framed-bgcolor',
      layout:'fit'
      //height:height
    });
    return this.tree;
  }
});