Ext.define('Ninja.panel.InvestorsGroupPanel',{
  extend:'Ext.panel.Panel',
  border:0,
  layout:'border',
  initComponent: function(){
    var me = this;
    var investorsGroup = Ext.create('Ninja.grid.InvestorsGroupGrid',{
      region:'west',
      flex:2,
      listeners:{
        afterrender:function(cmp){
          cmp.getStore().load({
            scope:this,
            callback:function(records){
              var record = records[0];
              if(!record) return;
              cmp.getSelectionModel().select(record);    
            }
          });
        },
        select:function(cmp, model){
          me.loadGroupMember(model.get('id'));
        }
      }
    });
    me.groupMembers = Ext.create('Ninja.grid.InvestorGroupMembers',{
      region:'center', 
      flex:3
    });
    me.items = [investorsGroup, me.groupMembers];
    me.callParent(arguments);
  },

  loadGroupMember:function(groupId){
    var me = this;
    var store = me.groupMembers.getStore();
    store.getProxy().url = '/groups/' + groupId + '/group_members.json';
    store.load();
  }

});