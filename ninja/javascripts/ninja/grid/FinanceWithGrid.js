Ext.define('Ninja.grid.FinanceWithGrid',{
  extend:'Ext.container.Container',
  style:{
    backgroundColor:"#C5C5C5;"
  },
  initComponent:function(){
    Ext.apply(this,{
      layout:{
        type:'border'
      },
      items:[this.createGridPanel()]
    });
    this.callParent(arguments);
  },

  createGridPanel:function(){
    var me = this;
    var store = me.createStore();
    var grid = Ext.create('Ext.grid.Panel',{
      region:'center',
      padding:'0 0 0 0',
      itemId:'financeWith',
      store:store,
      columns:me.createColumns(),
      tbar:me.createTbar(store),
      bbar:me.createBbar(store)
    });
    return grid;
  },

  createColumns:function(){
    var me = this;
    var columns = {
      defaults:{
        sortable:true,
        align:"center",
        flex:1
      },
      items:[
        { xtype: 'rownumberer',width: 30,sortable: true},
        {
          text:'配资人',
          dataIndex:'customer',
          flex:1,
        },
        {
          text:'帐号',
          dataIndex:'login',
          flex:1,
        },
        {
          text:'当日初始资金',
          dataIndex:'current_init_capital',
          flex:1,
        },
        {
          text:'配额',
          dataIndex:'quota',
          flex:1,
        },
        {
          text:'风险保证金',
          dataIndex:'margin',
          flex:1,
        },
        {
          text:'收费方式',
          dataIndex:'mode',
          flex:1,
        },
        {
          text:'当日应收',
          dataIndex:'current_receivable',
          flex:1,
        },
        {
          text:'当日实收',
          dataIndex:'current_paid',
          flex:1,
        },
        {
          text:'状态',
          dataIndex:'status',
          flex:1,
          renderer:function(value,meta){
            if (value == 0) {
              meta.style += "color:red;";
              return "未出帐";
            }
            if (value == 1) {
              meta.style += "color:green";
              return "已出帐";
            }
          }
        },
        {
          text:'备注',
          dataIndex:'comment',
          flex:1,
        }
      ]
    };
    return columns;
  },

  createStore:function(){
    var me = this;
    var store = Ext.create('Ext.data.Store', {
      fields:[
        {name: 'customer'},
        {name: 'login'},
        {name: 'current_init_capital'},
        {name: 'quota'},
        {name: 'margin'},
        {name: 'mode'},
        {name: 'current_receivable'},
        {name: 'current_paid'},
        {name: 'status'},
        {name: 'comment'}
      ],
      autoLoad:true,
      proxy:{
        url:'/finance_withs.json',
        type:'ajax',
        reader:{
          type:'json',
          root:'records'
        }
      }
    });
    return store;
  },

  createTbar:function(store){
    var me = this;
    var tbar = Ext.create('Ext.toolbar.Toolbar',{
      items: [
        {
          text:'增加配资',
          handler:function(){
            var incre_window = Ext.create('Ninja.window.NewFinanceWithWindow');
            incre_window.show();
          }
        },
        {
          text:'出账',
          handler:function(){
            var finace_with = me.getSelectionModel().getSelection()[0];
            if (records.length <= 0){
                  Ext.Msg.alert('提示','至少选择一条出金记录');
                  return;
              }
            me.receivable(finace_with,store);
          }
        },
        {
          text:'收账',
          handler:function(){
            var records = me.getSelectionModel().getSelection()[0];
            if (records.length <= 0){
                  Ext.Msg.alert('提示','至少选择一条出金记录');
                  return;
              }
            me.paid(record,store);
          }
        },
        {
          xtype:'datefield',
          itemId:'start_date',
          fieldLabel:'时间',
          width:148,
          labelWidth:33,
          editable:false,
          format:'Y-m-d',
          value:new Date(),
          maxValue:new Date()
        },
        {
          xtype:'label',
          text:'-'
        },
        {
          xtype:'datefield',
          itemId:'end_date',
          editable:false,
          width:110,
          format:'Y-m-d',
          value:new Date(),
          maxValue:new Date
        },
        {
          text:'查询',
          handler:function(){
            var start_date = me.down("#start_date").getValue();
            var end_date   = me.down("#end_date").getValue();
            me.searchDate(start_date,end_date);
          }
        }
      ]
    });
    return tbar;
  },

  createBbar:function(store){
    var bbar = Ext.create('Ext.toolbar.Paging', {
      store:store,
      displayInfo:true
    });
    return bbar;
  },
  //出帐与收帐方法
  receivableAndPaid:function(finace_with,mode){
    
  },
  //按时间筛选
  searchDate:function(start_date,end_date){
    var financeWith = Ext.ComponentQuery.query("#financeWith")[0];
    var store = financeWith.getStore();
    var proxy = store.getProxy();
    if (!Ext.isEmpty(start_date) && !Ext.isEmpty(end_date)) {
      var dateutil = end_date.getDate()+1;
      end_date.setDate(dateutil);
      var started_at = Ext.Date.format(start_date,'Y-m-d H:i:s');
      var ended_at   = Ext.Date.format(end_date,'Y-m-d H:i:s');
    } 
    proxy.extraParams['ended_at'] = ended_at;
    proxy.extraParams['started_at'] = started_at;
    store.getProxy().url = '/finance_withs/search.json';
    store.load();
  }
});