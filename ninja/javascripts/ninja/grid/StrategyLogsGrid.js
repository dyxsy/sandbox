
Ext.define('Ninja.grid.StrategyLogsGrid', {
  extend: 'Ext.grid.Panel',
  title: '策略日志',
  columnLines: true,
  enableColumnMove: false,
  flex:1,
  border: true,
  split : true,
  multiSelect:true,//运行多选,
  viewConfig: {
    stripeRows: true
  },
  initComponent: function(){
    var me  = this,
    store   = me.createStore(),
    columns = me.createColumns();
    // bbar = me.createBbar(store),
    Ext.apply(me, {
      columns: columns,
      store: store
      // bbar: bbar
    }); 
    me.callParent(arguments);
  },
  listeners:{
    afterrender:function(cmp){
      //cmp.getStore().load();
    }
  },

  createColumns: function(){
    var columns = {
      defaults:{
        sortable: false,
        align: "center",
        flex: 1
      },
      items:[
        {text: '账号',  dataIndex:'login'},
        {text: '策略',  dataIndex:' '},
        {text: '类型',  dataIndex:''},
        {text: '创建者',  dataIndex:' '},
        {text: '运行节点',  dataIndex:''},
        {text: '触发时间',  dataIndex:' '},
        {text: '动作',  dataIndex:''},
        {text: '结果',  dataIndex:' '}
      ]};
    return columns;
  },
  
  // 创建 数据源
  createStore: function(){
    var me = this;
    var store = Ext.create('Ext.data.Store', {
      pageSize: 20,
      fields:[
        {name: 'login'},
        {name: ''},
        {name: ''},
        {name: ''},
        {name: ''},
        {name: ''},
        {name: ''},
        {name: ''}
      ],
      proxy: {
        url: '/strategy_logs.json',
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
  
  loadData: function(investoId){
  }
});