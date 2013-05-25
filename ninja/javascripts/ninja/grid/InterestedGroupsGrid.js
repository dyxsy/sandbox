Ext.define('Ninja.grid.InterestedGroupsGrid', {
  extend: 'Ext.grid.Panel',
  itemId:'groupsGrid',
  columnLines: true,
  enableColumnMove: false,
  flex:0.4,
  border: true,
  split : true,
  region: 'west',
  viewConfig: {
    stripeRows: true
  },
  mixins:{
    websocketEvent:'Ext.ex.data.AttachWebSocketEvent',
  },
  datastoreUrl:undefined,

  initComponent: function(){
    var me  = this,
      store   = me.createStore();

    Ext.apply(me, {
      store: store 
    });
    me.callParent(arguments);
  },
  
  // 创建 数据源
  createStore: function(){
    var me = this;
    var store = Ext.create('Ext.data.Store', {
      pageSize: 20,
      fields:[{name:'id'},{name: 'name'}, {name: 'member_count'}, {name: 'out_id'}],
      autoLoad: true,
      proxy: {
        url: me.datastoreUrl,
        type: 'ajax',
        reader: {
          type: 'json',
          root: 'records'
        }
      },
      /*sorters:[{
        property: 'name',
        direction: 'ASC'
      }],
      */
      listeners: {
        beforeLoad: function(ds){
          ds.removeAll(false);
        },
        load: function(ds, records){
          //var url = Ninja.App.socketBaseURI+"admins/"+1;
          //me.websocket = me.connect(url);
        }
      },
      callback:function(ds, result){
      }
    });
    me.attach(store);
    return store;
  }

});