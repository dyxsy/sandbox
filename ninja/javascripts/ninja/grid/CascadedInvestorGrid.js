Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath({
 'Ext.ux'  : '/assets/ext-4.1.0/ux'
});

Ext.require([
  'Ext.ux.RowExpander'
]);
Ext.define('Ninja.grid.CascadedInvestorGrid', {
  extend: 'Ext.grid.Panel',
  itemId:'cascadedInvestorGrid',
  columnLines: true,
  enableColumnMove: true,
  flex:3.5,
  border: true,
  split : true,
  multiSelect:false,
  selectRecord: undefined,
  selectRecordNo: 0,
  isExpandbody: false,
  div: undefined,
  rowIdx: undefined,
  investorOutId: undefined,
  region: 'center',
  viewConfig: {
    style: { overflow: 'auto', overflowX: 'hidden' }
  },
  plugins: [{
    ptype: 'rowexpander',
    itemId: "rowexpander_plugin",
    rowBodyTpl: ['<div class="ux-row-expander-box"></div>']
    //expandOnRender: false,
    //expandOnDblClick: true
    // selectRowOnExpand:false
  }],
  datastoreUrl:undefined,

  mixins: {
    formatter: 'Ninja.util.Formatter',
    websocketEvent:'Ext.ex.data.AttachWebSocketEvent',
    
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
    
    me.getView().on('expandbody', function(node, record, eNode) {
      //增加边框
      me.isExpandbody = true;
      var table = node.firstChild.firstChild.firstChild;
      table.setAttribute("style",'border: 2px solid #00CCFF;');
      me.getSelectionModel().deselectAll();
      me.div = Ext.get(eNode).down('.ux-row-expander-box').down('div');
      
      if(me.div){
        me.div.show();
        var embedGrid = Ext.ComponentQuery.query("#embedGrid"+ record.get("id"))[0];
        //embedGrid.getStore().subscribe(record.get("id"), "positions");
        return;
      }
      me.gridMlement = Ext.get(eNode).down('.ux-row-expander-box');
      var columns = me.createPositionColumns();
      var store = me.createPoStore(record.get("id"));
    
      var grid = Ext.create('Ext.grid.Panel', {
        itemId:'embedGrid' + record.get("id"),
        open:true,
        hideHeaders: false,
        border: true,
        enableColumnMove: true,
        viewConfig: {
          style: { overflow: 'auto', overflowX: 'hidden',  forceFit:true}
        }, 
        columns:columns,
        store:store
      });

      grid.on('itemclick', function(view) {
         me.getView().getSelectionModel().deselectAll();
      });

     me.gridMlement.swallowEvent(['click', 'mousedown', 'mouseup', 'dblclick'], true);

      grid.render(me.gridMlement);
      // 订阅用户持仓数据
      grid.getStore().subscribe(record.get("id"), "positions");
    });

    me.getView().on('collapsebody', function(node, record, eNode) {
      //去掉边框
      me.isExpandbody = false;
      var table = node.firstChild.firstChild.firstChild;
      table.setAttribute("style",'border: 0px;');
      /*
      me.div = Ext.get(eNode).down('.ux-row-expander-box').down('div');
      if(me.div != null){
        me.div.hide();
      } 
      */
    });

    me.on('resize',function(cmp, width, height){
      var embedGrids = Ext.ComponentQuery.query('grid[open="true"]');
      for(var i=0;i<embedGrids.length;i++){
        var embedGrid = embedGrids[i];
        if(embedGrid && !embedGrid.hidden){
          embedGrids[i].setWidth(width-29);
        }
      }
    });

    me.on("beforeitemclick", function(cmp, record, item, index){
      me.selectRecord   = record;
      me.selectRecordNo = index;
      me.rowIdx         = item;
    });
  },

  createColumns: function(){
    var me = this;
    var columns = {
      defaults:{
        sortable: false,
        align: "center"
      },
      items:[
        {text: '账号',  dataIndex:'login', flex:1},
        {text: '姓名',  dataIndex:'name',flex:1},
        {text: '当日初始资金',  dataIndex:'yuan_account.current_init_capital',flex:1, renderer : me.formatPrice},
        {text: '总权益',  dataIndex:'yuan_account.total',flex:1, renderer : me.formatPrice},
        {text: '持仓盈亏',  dataIndex:'yuan_account.position_profit', flex:1,renderer : me.formatColorPrice},
        // {text: '平仓盈亏',  dataIndex:'yuan_account.close_profit2', flex:1,renderer : me.formatColorPrice},
        {text: '总盈亏',  dataIndex:'yuan_account.profit2', flex:1,renderer : me.formatColorPrice},
        {text: '保证金',  dataIndex:'yuan_account.margin',flex:1, renderer : me.formatPrice},
        {text: '风险度',  dataIndex:'yuan_account.risk_degree', flex:1,renderer: me.formatColorPerc},
        {text: '标签1',  dataIndex:'',flex:1},
        {text: '标签2',  dataIndex:'',flex:1}
      ]};
    return columns;
  },
  
  
  // 创建 数据源
  createStore: function(){
    var me = this;
    Ext.define('Account', {
      extend: 'Ext.ex.data.DomainKeyModel',
      fields: [
        {name: 'login'},
        {name: 'name'},
        {name: "id"},
        {name: "out_id"},
        {name: 'yuan_account.id'},
        {name: 'yuan_account.current_init_capital'},
        {name: 'yuan_account.total'},
        {name: 'yuan_account.position_profit'},
        {name: 'yuan_account.close_profit2'},
        {name: 'yuan_account.profit2'},
        {name: 'yuan_account.margin'},
        {name: 'yuan_account.risk_degree'}
      ],
      keyFields : ['id']
    });
    var store = Ext.create('Ext.data.Store', {
      model: "Account",
      proxy: {
        url: me.datastoreUrl,
        type: 'ajax',
        reader: {
          type: 'json',
          root: 'records'
        }
      },
      listeners: {
        beforeLoad: function(ds){
          ds.removeAll(false);
        },
        load: function(ds){
          me.attachWebSocketEvent(ds, "equity", me.group_out_ids, me.investorId);
        },
        recordupdate: function(store, record, index){
          if(me.selectRecord){
            me.getSelectionModel().select(me.selectRecordNo, false);
          }
        }
      }
    });
  
    return store;
  },
 //持仓columns
  createPositionColumns: function(){
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

  //持仓store
  createPoStore: function(){
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
  
  //创建顶部工具条
  createTbar: function(store){
    var me = this;
    var searchField = Ext.create('Ext.ux.form.SearchField', {
      fieldLabel: '搜索',
      labelWidth: 35,
      width: 200,
      margin: '0 5 0 0',
      store: store,
      searchURL: '/investors/filter.json'
    });

    var items = [
      '->',
      searchField,
      {
        text: '高级搜索',
        handler: function(){
          var win = Ext.create('Ninja.window.AdvancedSearchWindow',{
            grid: this
          });
          win.show();
        },scope: me
      }];
    return Ext.create('Ext.toolbar.Toolbar', { items: items });
  },

  // 创建底部工具条
  createBbar:function(store){
    var pagingToolbar = Ext.create('Ext.toolbar.Paging',{
      store:store,
      displayInfo:true
    });
    return pagingToolbar;
  },

  attachWebSocketEvent: function(ds, events, groupOutId, investorOutId, wsListeners){
    var me = this;
    data = {gids: groupOutId, maid: investorOutId};
    me.attach(ds);
    var url = Ninja.App.socketBaseURI+"admins/"+ 1 + "/" + me.position;
    console.log("create websocket: " + url);
    var websocket = me.connect(url, events, data, wsListeners);
  }
});
