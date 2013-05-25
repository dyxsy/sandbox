
Ext.define('Ninja.grid.InstrumentEdit', {
  extend: 'Ext.grid.Panel',
  columnLines: true,
  enableColumnMove: false,
  split : true,
  multiSelect:false,//运行多选
  region: 'west',
  viewConfig: {
    stripeRows: true
  },

  initComponent: function(){
    var me  = this,
    store   = me.createStore(),
    columns = me.createColumns();
    Ext.apply(me, {
      columns: columns,
      store: store 
    });   
    me.callParent(arguments);
    
  },
  createColumns: function(){
    var columns = {
      defaults:{
        // sortable: false,
        align: "center"
      },
      items:[
        { xtype: 'rownumberer',width: 30,sortable: false},
        {text: '合约',  dataIndex:'code', flex:1},
        {
         header:'修改',flex:1,xtype:'actioncolumn',renderer:function(){return '<input type="button" onclick="update()" value="只平" style="width:70px">'}
        }

      ]};
    return columns;
  },
  update: function(){
    alert('update');
  },
  
  // 创建 数据源
  createStore: function(){
    var me = this;
    var store = Ext.create('Ext.data.Store', {
      pageSize: 20,
      fields:[
        {name: 'code'}
      ],
      autoLoad: true,
      proxy: {
        url: '/instruments.json',
        type: 'ajax',
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
  
  //
  createBbar:function(store){
    var pagingToolbar = Ext.create('Ext.toolbar.Paging',{
      store:store,
      displayInfo:true
    });
    return pagingToolbar;
  }
});