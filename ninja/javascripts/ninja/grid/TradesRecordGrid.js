Ext.define("Ninja.grid.TradesRecordGrid",{
  extend : "Ext.grid.Panel",
  columnLines: true,
  enableColumnMove: false,
  enableColumnHide:false,
  title: '成交记录',
  viewConfig: {
    stripeRows: true
  },
  mixins: {
    formatter: 'Ninja.util.Formatter'
  },
  initComponent:function(){
    var store   = this.createStore();
    var columns = this.createColumns();
    var tbar    = this.createTbar();
    var bbar    = this.createBbar(store);
    var plugins = me.createRowEditing();
    Ext.apply(this,{
      columns: columns,
      //plugins: plugins,
      store: store,
      bbar : bbar,
      tbar : tbar
    });
    this.callParent(arguments);
  },
  listeners:{
    afterrender:function(){
      var ds = this.getStore();
      ds.load();
    }
  },
  
  /*
  * 创建列
  */
  createColumns:function(){
    var me = this;
    var columns = {
      defaults:{
        sortable: true,
        align: "center"
      },
      items:[
        { xtype: 'rownumberer',width: 30,sortable: false},
        { header: "合约",    dataIndex:"instrument_code", flex: 1},
        { header: "买/卖",    dataIndex: "direction", flex: 1, renderer: me.formatDirection},
        { header: "投机/套保", dataIndex: "vorh", flex: 1, renderer: me.formatVorh},
        { header: "成交价", dataIndex: "cost", flex: 1, renderer : me.formatPrice},
        { header: "手数", dataIndex: "volume", flex: 1},
        { header: "成交额", dataIndex: "amount", flex: 1, renderer : me.formatPrice},
        { header: "开/平", dataIndex: "offset", flex: 1, renderer: me.formatOffset},
        { header: "手续费", dataIndex: "commission", flex: 1, renderer : me.formatPrice},
        { header: "平仓盈亏", dataIndex: "close_profit", flex: 1,renderer : me.formatColorPrice}
      ]
    };
    return columns;
  },
  
  createStore: function(){
    var me = this;
    me.store = Ext.create('Ext.data.Store', {
      fields:[
        {name: 'instrument_code'},
        {name: 'direction'},
        {name: 'vorh'},
        {name: 'cost'},
        {name: 'amount'},
        {name: 'offset'},
        {name: 'close_profit'},
        {name: 'commission'},
        {name: 'volume'}
      ],
      proxy: {
        type: 'ajax',
        url: '/cfmmc/index3.json',
        reader: {
          type: 'json',
          root: 'records'
        },
        simpleSortMode: true
      },
      listeners: {
        beforeLoad: function(store){
          store.removeAll(false);
        }
      }
    })
    return me.store;
  },

  /*
  *  创建底部工具栏
  */
  createBbar:function(store){
    var bbar = Ext.create('Ext.toolbar.Paging', {
      store: store,
      displayInfo: true
    });
    return bbar;
  },
  createTbar:function(){
    me = this;
    var tbar = Ext.create('Ext.toolbar.Toolbar', {
      items: [{
        text:"导入成交记录",
        listeners:{
          click : function() {
            Ext.create('Ninja.window.ImportTradesWindow',{
              tradeGrid: me
            }).show();
          }
        }
      },{
        text: "生成页面",
        handler: function(){
          //window.location.href="cfmmc/index2";
          window.open("cfmmc/index2");
        }
      }]
    });
    return tbar;
  },

  createRowEditing:function(){
    var me = this;
    me.rowEditing = Ext.create('Ext.ux.grid.RowEditing', {
      errorSummary :false,
      clicksToMoveEditor: 2,
      autoCancel: false,
      listeners:{
        edit:function(){
          
        },
        beforeedit:function(){
          
        },
        canceledit:function(){
          
        }
      }
    });
    return me.rowEditing;
  }
});
