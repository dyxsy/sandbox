// 可交易合约
Ext.define("Ninja.grid.InstrumentCtrlsGrid",{
  extend : "Ext.grid.Panel",
  columnLines: true,
  enableColumnMove: false,
  multiSelect:true,//运行多选
  viewConfig: {
    stripeRows: true
  },
  initComponent:function(){
    var store = this.createStore();
    Ext.apply(this,{
      columns: this.createColumns(),
      store: store,
     // bbar: this.createBbar(store),
      tbar: this.createTbar()
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
        { header: "合约编号",    dataIndex:"code", flex: 1 },
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
        },
        { header: "交易状态",    dataIndex:"forbid",  flex: 1 ,
          renderer: function(value){
            if(value == 1){
              return '只可平';
            }
            if(value == 2){
              return '只可开';
            }
            if(value == 3){
              return '禁止交易';
            }
            if(value == 4){
              return '可交易';
            }
          }
        },
      ]
    };
    return columns;
  },
  
  createStore: function(){
    var me = this;
    me.store = Ext.create('Ext.data.Store', {
      fields:[
        {name: 'investor_id'},
        {name: 'instrument_id'},
        {name: 'variety'},
        {name: 'code'},
        {name: 'exchange_name'},
        {name: 'volume_multiple'},
        {name: 'subscribed'},
        {name: 'price_tick'},
        {name: 'forbid'}
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
        property: 'code',
        direction: 'ASC'
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

  createTbar:function(){
    var me = this;
    var tbar = Ext.create('Ext.toolbar.Toolbar', {
      items: [
      Ext.create('Ext.Button', {
        text: '设置',
        handler: function() {
          var records = me.getSelectionModel().getSelection();
          var instrumentsId = ''
          for(var i = 0; i<records.length; i++){
            if(i!=records.length-1)
              instrumentsId += records[i].get("instrument_id")+',';
            else
              instrumentsId += records[i].get("instrument_id");
          }
          //create window
          var win = Ext.create('Ninja.window.InstrumentCtrlWindow');
          win.show();
        }
      })]
    });
    return tbar;
  }
   
});
