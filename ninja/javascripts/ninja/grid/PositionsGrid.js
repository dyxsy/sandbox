
Ext.define('Ninja.grid.PositionsGrid', {
  extend: 'Ext.grid.Panel',
  title: '持仓信息',
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
        {text: '合约',     dataIndex:'instrument_code'},
        {text: '方向',     dataIndex:'direction', renderer: me.formatDirection},
        {text: '今/昨',    dataIndex:'pos_type', renderer: me.formatPosType},
        {text: '投/套',    dataIndex:'vorh', renderer: me.formatVorh},

        {text: '数量',     dataIndex:'volume'},
        {text: '可用',     dataIndex:'available'},
        {text: '成本价',    dataIndex:'price', renderer: me.formatPrice},
        {text: '最新价',    dataIndex:'last_price', renderer: me.formatPrice},
        {text:'手续费',     dataIndex:'commission'},
        {text:'盈亏金额',   dataIndex:'profit', renderer: me.formatColorPrice},
        {text:'盈亏比例',   dataIndex:'profit_ratio'}
      ]};
    return columns;
  },

  createStore: function(){
    Ext.define('Position', {
        extend: 'Ext.ex.data.DomainKeyModel',
        fields: [
          {name: 'investor_id'},
          {name: 'instrument_code'},
          {name: 'direction'},
          {name: 'pos_type'},
          {name: 'vorh'},
          {name: 'volume'},
          {name: 'available'},
          {name: 'price'},
          {name: 'last_price'},
          {name: 'commission'},
          {name: 'profit'},
          {name: 'offset'},
          {name: 'profit_prec'}
        ],
        keyFields : ['investor_id','instrument_code','direction', 'pos_type']
      });
    var store = Ext.create('Ninja.data.WebSocketStore', {
      model: 'Position',
      baseUrl: Ninja.App.socketBaseURI + "investors/{0}/positions",
      proxy: {
        type: "websocket",
        reader: {
          type: 'json',
          root: 'positions'
        }
      },
      determineAction: function(record){
        if(parseInt(record.get("volume")) == 0){
          return 'purge';  
        }
        return 'update';
        
      }
    });
    return store;
  },

  loadData: function(investoId){
    var me = this;

    me.getStore().subscribe(investoId, "positions");
  }
});