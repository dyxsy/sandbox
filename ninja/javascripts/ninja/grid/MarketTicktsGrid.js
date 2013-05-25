
Ext.define('Ninja.grid.MarketTicktsGrid', {
  extend: 'Ext.grid.Panel',
  id: 'mtg',
  columnLines: true,
  enableColumnMove: false,
  border: false,
  multiSelect:true,//运行多选
  loadMask: true,
  viewConfig: {
    trackOver: false
  },
  width:500,
  height: 400,
  scroll:true,
  renderTo: Ext.getBody(),
  initComponent: function(){
    var me  = this,
    MarketTickt = me.createMarketTickt(),
    store   = me.createStore(MarketTickt),
    columns = me.createColumns(),
    array =[],
    url = 'ws://192.168.1.105:8880/market_ticks';
    websocket = me.createWebSocket(url,store,20,array,true,new Date());
    Ext.ux.WebSocketManager.register(websocket);
    Ext.apply(me, {
      columns: columns,
      store:   store
    });
    me.callParent(arguments);
  },

  createColumns: function(){
    var columns = {
      defaults:{
        sortable: false,
        align: "left"
        // flex: 1
      },
      items:[
        // { xtype: 'rownumberer',width: 35,sortable: false},
        {text: '时间', dataIndex: 'times',width:150},
        {text: '合约',  dataIndex:'instrument',width:80},
        {text: '最新价',  dataIndex:'tick',width:80},
        {text: '成交量',  dataIndex:'volume',flex:1}
      ]
    };
    return columns;
  },
   
    // 创建 数据源
  createStore: function(MarketTickt){
    var me = this;
    var store =  Ext.create('Ext.data.Store', {
      autoLoad : true,
      autoSync : true,
      model: MarketTickt,
      proxy: {  
        type: 'memory'
      }
    });
    return store;
  },

  createMarketTickt : function(){
    me = this;
    var MarketTickt = Ext.define('MarketTickt', { 
      extend: 'Ext.data.Model', 
      fields: [
        { name: 'times', xtype:'datecolumn'}, 
        { name: 'instrument', type: 'string' }, 
        { name: 'tick', type: 'number' } ,
        { name: 'volume',type: 'number'}
      ] 
    });
   return MarketTickt;
  },

  createWebSocket : function(url,store,count,array,j,date){
    var me = this;
    var websocket = Ext.create ('Ext.ux.WebSocket', {
          url: url,
          listeners: {
            open: function (ws) {
        
            } ,
            message: function (ws, message) {
              if(j==true){
                for(var i=0;i<20;i++){
                  message.times = 0;
                  message.instrument = 0;
                  message.tick = 0;
                  message.volume = 0;
                  array.push(message);
                }
                j=false;
              }
              if(message!=null){
                var message =  Ext.JSON.decode(message);
                if(count>19){
                  for(var i=0;i< count-19;i++){
                    array.shift();
                    count--;
                  }
                }
                date = new Date();
                message.data.times = Ext.Date.format(date,'Y-m-d H:i:s') + ':' + date.getMilliseconds();
                array.push(message.data);
                count++;
                store.loadData(array,false);
              }
            },
            close: function (ws) {
            } 
            
          }
    });
    return websocket;
  },
  listeners:{
    afterlayout: function(cmp){
      cmp.getView().focusRow(19);
    }
  }
});
