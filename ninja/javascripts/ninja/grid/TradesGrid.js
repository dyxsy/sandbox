
Ext.define('Ninja.grid.TradesGrid', {
  extend: 'Ext.grid.Panel',
  title: '成交记录',
  columnLines: true,
  enableColumnMove: false,
  border: true,
  //selType:'checkboxmodel',//设定选择模式
  multiSelect: false,//不运行多选
  viewConfig: {
    stripeRows: true
  },
  mixins: {
    formatter: 'Ninja.util.Formatter'
  },
  
  initComponent: function(){
    var me  = this,
    store   = me.createStore(),
    columns = me.createColumns();
    Ext.apply(me, {
      columns: columns,
      store:   store
    });
    me.callParent(arguments);
    
  },

  listeners:{
    afterlayout: function(cmp){
      cmp.getView().focusRow(cmp.getStore().getCount() - 1);
    }
  },

  createColumns: function(){
    var me = this;
    var columns = {
      defaults:{
        sortable: false,
        align: "center"
      },
      items:[
        {  text: '合约',    
           dataIndex:'instrument_code',
           width: 50
        },
        {  text: '手数',    
           dataIndex:'volume', 
           width: 35,
           sortable: true},
        {  text: "方向", 
           dataIndex: "direction",
           width: 35, 
           renderer: me.formatDirection2
        },{
          text: "开/平仓",
          dataIndex:'offset',
          width: 45, 
          renderer: me.formatOffset
        },
        {  text: '价格',   
           dataIndex:'cost',
           width: 55,
           renderer : me.formatPrice
        },
        {  text: '平仓盈亏',   
           dataIndex:'close_profit',
           width: 55,
           renderer : me.formatColorPrice
        },
        {  text: '成交时间',    
           dataIndex:'trade_time',
           flex: 1, 
           renderer : me.formatDatetime
        }
      ]};
    return columns;
  },

  // 创建 数据源
  createStore: function(){
    var me = this;
    Ext.define('Trade', {
      extend: 'Ext.ex.data.DomainKeyModel',
      fields: [
        {name: 'id'},
        {name: 'investor_id'},
        {name: 'direction'},
        {name: 'instrument_code'},
        {name: 'volume'},
        {name: 'cost'},
        {name: 'local_no'},
        {name: 'trade_time'},
        {name: 'receive_time'},
        {name: 'close_profit'},
        {name: 'offset'},
        {name: 'status'}
      ],
      keyFields : ['investor_id','receive_time']
    });
    
    var store = Ext.create('Ninja.data.WebSocketStore', {
      model: 'Trade',
      baseUrl: Ninja.App.socketBaseURI  + "investors/{0}/trades",
      proxy: {
        type: "websocket",
        reader: {
          type: 'json',
          root: 'trades'
        }
      },
      sorters: [{
        property: 'trade_time',
        direction: 'ASC'
      }]
    });
    return store;
  },
 
  createBbar:function(store){
    var pagingToolbar = Ext.create('Ext.toolbar.Paging',{
      store:store,
      displayInfo:true
    });
    return pagingToolbar;
  },

  loadData: function(investoId){
    var me = this;
    me.getStore().subscribe(investoId, "trades");
  }
});