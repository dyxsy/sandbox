
Ext.define('Ninja.grid.OrdersGrid', {
  extend: 'Ext.grid.Panel',
  title: '委托信息',
  columnLines: true,
  enableColumnMove: false,
  border: true,
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
      store: store
    }); 
    me.callParent(arguments);
    
  },
  createColumns: function(){
    var me = this;
    var columns = {
      defaults:{
        sortable: false,
        align: "center",
        flex: 1
      },
      items:[
        {text: '合约',    dataIndex:'instrument_code'},
        {text: '方向',    dataIndex:'direction', renderer: me.formatDirection},
        {text: '开/平',   dataIndex:'offset', renderer: me.formatOffset},
        {text: '手数',    dataIndex:'volume'},
        {  text: '状态',    
           dataIndex:'status',
           width: 40,
           renderer : function(value){
             if(!Ext.isEmpty(value)){
               if(value == 1){
                 return "申报";
               } else if(value == 2){
                 return "挂单";
               } else if(value == 6){
                 return "撤单";
               } else if(value == 4){
                 return "部分成交";
               } else if(value == 5){
                 return "成交";
               }
             } 
           }
        },
        {text: '报价',    dataIndex:'cost', renderer : me.formatPrice},
        {text: '委托时间', dataIndex:'trade_time', renderer : me.formatDatetime},
        {text:'本地单号',  dataIndex:'local_no'},
        {text:'执行者',   dataIndex:'ex_user_id'}
      ]};
    return columns;
  },
  
  
  // 创建 数据源
  createStore: function(){
    var me = this;
    Ext.define('Order', {
      extend: 'Ext.ex.data.DomainKeyModel',
      fields: [
        {name: 'instrument_code'},
        {name: 'direction'},
        {name: 'offset'},
        {name: 'volume'},
        {name: 'traded_volume'},
        {name: 'status'},
        {name: 'cost'},
        {name: 'trade_time'},
        {name: 'local_no'},
        {name: 'ex_user_id'}
      ],
      keyFields : ['local_no']
    });

    var store = Ext.create('Ninja.data.WebSocketStore', {
      model: 'Order',
      baseUrl: Ninja.App.socketBaseURI + "investors/{0}/orders",
      proxy: {
        type: "websocket",
        //url: Ninja.App.socketBaseURI,
        reader: {
          type: 'json',
          root: 'orders'
        }
      },
      determineAction: function(record){
        var status = parseInt(record.get("status"));
        if(status == 6){
          return 'purge';
        }else if(status == 2){
          return 'update';
        }else{
          if(parseInt(record.get("traded_volume")) == parseInt(record.get("volume"))){
            return 'purge';  
          }
          return 'update';
        }
      }
    });
    return store;
  },
 
  loadData: function(investoId){
    var me = this;
    me.getStore().subscribe(investoId, "orders");
  }
});