Ext.define('Ninja.form.PermissionsForm', {
  mixins: {
    permissionsUtil: 'Ninja.util.PermissionsUtil'
  },
  extend: 'Ext.form.Panel',
  buttonAlign: 'left',
  title: '权限选项',
  bodyCls: 'framed-bgcolor',
  border: false,
  initComponent: function() {
    var me = this;
    me.on("afterrender",function(cmp){
      var checkbox = Ext.ComponentQuery.query('checkbox');
      for(var i = 0; i< checkbox.length;i++){
        if(!Ext.isEmpty(checkbox[i].powerBit,false)){
          var result = this.allow(this.permissions,checkbox[i].powerBit);
          checkbox[i].setValue(result);
        }
      }
    },me);
    me.items = me.fields;
    me.buttons = me.createButton(me.role_id);
    me.callParent(arguments);
  },
  
  // 创建提交按钮
  createButton: function(role_id){
    var btn = [{
        text: '全选',
        handler: function(){
          var checkbox = Ext.ComponentQuery.query('checkbox');
            for(var i = 0; i< checkbox.length;i++){
              if(checkbox[i].checked == true){
                checkbox[i].setValue(false);
              }else{
                checkbox[i].setValue(true);
              }
            }
        }
      },{
      text:'保存',
      handler: function(){
        var checkbox = Ext.ComponentQuery.query('checkbox');
        var powerBits = [];
        for(var i = 0; i< checkbox.length;i++){
          if(checkbox[i].checked == true){
            powerBits.push(checkbox[i].powerBit);
          }
        }
        var permissions = this.gen_permission(powerBits);
        var form = this.getForm();
        form.submit({
          url: '/roles/add_permissions.json',
          params: {
            role_id: role_id,
            permissions: permissions
          },
          method: 'POST',
          waitTitle: '保存',
          waitMsg: '保存中，请稍后...',
          success: function(){
            Ext.create('Ninja.window.NotificationWindow', {
              html: '保存成功'
            }).show();
          },
          failure: function(response,result){
            Ext.create('Ninja.window.NotificationWindow', {
              html: '保存失败'+result.result.msg
            }).show();
          }
        });
      },scope: this
    }];
    return btn;
  }
});
