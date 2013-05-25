Ext.define('Ninja.grid.InvestorsGrid', {
  extend: 'Ext.grid.Panel',
  border:0,
  columnLines: true,
  enableColumnMove: true,
  multiSelect:false,
  margin:'0 1 0 1',
  viewConfig: {
    style: { overflow: 'auto', overflowX: 'hidden' }
  },
  initComponent: function(){
    var me  = this,
   
    store   = me.createStore(),
    columns = me.createColumns(),
    bbar    = me.createBbar(store);
    
    Ext.apply(me, {
      columns: columns,
      store: store,
      bbar:bbar
    }); 
    me.callParent(arguments); 
  },

  createColumns: function(){
    var columns = {
      defaults:{
        sortable: true,
        align: "center"
      },
      items:[
        { xtype: 'rownumberer',width: 30,sortable: false},
        {text: '账号',  dataIndex:'login', flex:1},
        {text: '姓名',  dataIndex:'name', flex:1},
        {text: '当日初始资金',  dataIndex:'yuan_account.current_init_capital', flex:1},
        {text: '总权益',  dataIndex:'yuan_account.total', flex:1},
        {text: '持仓盈亏',  dataIndex:'yuan_account.position_profit', flex:1,
           renderer: function(v, meta){
            if (v < 0) {
              meta.style += "color:green;";
            } else if (v > 0) {
              meta.style += "color:red;";
            }
            return v;
          }
        },
        {text: '平仓盈亏',  dataIndex:'yuan_account.close_profit', flex:1,
            renderer: function(v, meta){
            if (v < 0) {
              meta.style += "color:green;";
            } else if (v > 0) {
              meta.style += "color:red;";
            }
            return v;
          }
        },
        {text: '总盈亏',  dataIndex:'yuan_account.profit', flex:1,
            renderer: function(v, meta){
            if (v < 0) {
              meta.style += "color:green;";
            } else if (v > 0) {
              meta.style += "color:red;";
            }
            return v;
          }
        },
        {text: '保证金',  dataIndex:'yuan_account.margin', flex:1}, 
        {text: '风险度',  dataIndex:'yuan_account.risk_degree', flex:1,
           renderer: function(v, meta){
             if(v!=null){
               if (v >= 80) {
                 meta.style += "color:green;";
                } 
              return v + '%';
             }
          }

        },
        {text: '标签1',  dataIndex:'', flex:1},
        {text: '标签2',  dataIndex:'', flex:1}
      ]};
    return columns;
  },
  
  
  // 创建 数据源
  createStore : function(){
    var me = this;
    me.store = Ext.create('Ext.data.Store', {
      pageSize: 25,
      fields:[
        {name: 'login'},
        {name: 'name'},
        {name: 'yuan_account.id'},
        {name: 'yuan_account.current_init_capital'},
        {name: 'yuan_account.total'},
        {name: 'yuan_account.position_profit'},
        {name: 'yuan_account.close_profit'},
        {name: 'yuan_account.profit'},
        {name: 'yuan_account.margin'},
        {name: 'yuan_account.risk_degree'},
        {name: ''},
        {name: ''}
      ],
      autoLoad: false,
      proxy: {
        url: '/investors/show_investors.json',
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
  
    return me.store;
  },

  createBbar:function(store){
    var bbar = Ext.create('Ext.toolbar.Paging', {
      itemId:'investorsBbar',
      store: store,
      displayInfo: true
    });
    return bbar;
  }

});