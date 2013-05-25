// 成交明细列表
Ext.define("Ninja.grid.InstrumentsGrid",{
  extend : "Ext.grid.Panel",
  columnLines: true,
  enableColumnMove: false,
  enableColumnHide:false,
  
  viewConfig: {
    stripeRows: true
  },
  initComponent:function(){
    var store = this.createStore();
    Ext.apply(this,{
      columns: this.createColumns(),
      store: store,
      bbar: this.createBbar(store),
      tbar: this.createTbar(store)
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
    var columns = {
      defaults:{
        sortable: true,
        align: "center"
      },
      items:[
        { xtype: 'rownumberer',width: 30,sortable: false},
        { header: "合约编号",    dataIndex:"code",                   flex: 1 },
        { header: "交易所",     
          dataIndex: "exchange_name",          
          flex: 1,
          renderer: function(value){
            if(value == "SHFE"){
              return "上海交易所";
            }else if(value == "DCE"){
              return "大连交易所";
            }else if(value == "CZCE"){
              return "郑州交易所";
            }else if (value == "CFFEX"){
              return "中金交易所"
            }
          }
      },
        { header: "乘数",       dataIndex: "volume_multiple", flex: 1},
        { header: "最小变动价", dataIndex: "price_tick",       flex: 1},
        { header: "交易状态", 
          dataIndex: "is_trading",
          flex: 1,
          renderer: function(value){
            if(value == 0){
              return '<span style="color:green">不可交易</span>';
            }else if(value == 1){
              return '<span style="color:red">交易中</span>';
            }
          }
        },
        { header: "订阅状态",       
          dataIndex: "subscribed",       
          flex: 1,
          renderer: function(value){
            if(value){
              return '<span style="color:red">已订阅</span>';
            }else{
              return '<span style="color:green">未订阅</span>';
            }

          }
        }
      ]
    };
    return columns;
  },
  
  createStore: function(){
    var me = this;
    me.store = Ext.create('Ext.data.Store', {
      fields:[
        {name: 'variety'},
        {name: 'code'},
        {name: 'exchange_name'},
        {name: 'volume_multiple'},
        {name: 'is_trading'},
        {name: 'subscribed'},
        {name: 'price_tick'}
      ],
      autoLoad: false,
      remoteSort: false,
      pageSize: 25,
      proxy: {
        type: 'ajax',
        url: '/instruments.json',
        reader: {
          type: 'json',
          root: 'records'
        },
        simpleSortMode: true
      },
      sorters: [{
        property: 'is_trading',
        direction: 'DESC'
      }],
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

  /*
  *  创建顶部工具栏
  */
  createTbar:function(store){
    var tbar = Ext.create('Ext.toolbar.Toolbar', {
      items: [,"->",
      Ext.create('Ext.ux.form.SearchField', {
        fieldLabel: '搜索',
        labelWidth: 35,
        width: 200,
        margin: '0 5 0 0',
        store: store,
        searchURL:'/instruments/search.json'
      })]
    });
    return tbar;
  }
});
