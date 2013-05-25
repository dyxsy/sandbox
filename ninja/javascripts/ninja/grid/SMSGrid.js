Ext.define('Ninja.grid.SMSGrid',{
  extend:'Ext.grid.Panel',
  title:'短信发送历史',
  border:0,
  viewConfig:{
    stripeRows:true
  },
  initComponent:function(){
    var me  = this,
      store   = me.createStore(),
      tbar    = me.createTbar(store),
      bbar    = me.createBbar(store),
      columns = me.createColumns();
    Ext.apply(me, {
      tbar: tbar,
      bbar: bbar,
      columns: columns,
      store: store
    }); 
    me.callParent(arguments);
  },
  listeners:{
    afterrender:function(cmp){
      cmp.getStore().load();
    }
  },

  createColumns:function(){
    var me = this;
    var columns = {
      items:[
        {text:'手机号码', dataIndex:'number', width:160},
        {text:'内容', dataIndex:'text', flex:1},
        {
          text:'发送时间', 
          dataIndex:'processed_date', 
          width:160,
          xtype:'datecolumn', 
          format:'Y-m-d H:i:s'
        },
        {
          text:'发送状态', 
          dataIndex:'processed', 
          width:160,
          renderer:function(value,meta,record,rowIndex){
            if(value == 0){
              return "等待发送中";
            }else if(value == 1){
              var error = me.store.getAt(rowIndex).get('error');
              if(error > 0){
                meta.style += "color:red;";
                return "发送失败";
              }else{
                meta.style += "color:green;";
                return "发送成功";
              }
            }  
          }
        }
      ]
    };
    return columns;
  },

  createStore:function(){
    var me = this;
    var store = Ext.create('Ext.data.Store',{
      fields:['number', 'text', 'processed_date', 'processed', 'error'],
      autoLoad:false,
      proxy:{
        type:'ajax',
        url:'/sms/outbox.json',
        reader:{
          type:'json',
          root:'records'
        }
      },
      listeners: {
        beforeLoad: function(ds){
          ds.removeAll(false);
        }
      }
    });
    return store;
  },

  createTbar:function(store){
    var me = this;
    var tbar = Ext.create('Ext.toolbar.Toolbar',{
      items:[
        {
          xtype:'datefield',
          itemId:'start_date',
          fieldLabel:'时间',
          labelWidth:40,
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
          format:'Y-m-d',
          value:new Date(),
          maxValue:new Date()
        },
        {
          xtype:'combo',
          itemId:'send_status',
          fieldLabel:'发送状态',
          labelWidth:65,
          width:160,
          editable:false,
          displayField:'name',
          valueField:'value',
          value:'3',
          store:Ext.create('Ext.data.Store',{
            fields:['name','value'],
            data:[
              {name:'全部',value:'3'},
              {name:'发送成功',value:'1'},
              {name:'发送失败',value:'2'},
              {name:'等待发送中',value:'0'}
            ]
          })
        },
        {
          text:'查询',
          handler:function(){
            var start_date = me.down("#start_date").getValue();
            var end_date   = me.down("#end_date").getValue();
            var send_status   = me.down("#send_status").getValue();
            me.searchData(start_date, end_date, send_status);
          }
        },
        "->",
        Ext.create('Ext.ux.form.SearchField',{
          fieldLabel:'搜索',
          labelWidth:35,
          width:200,
          margin:'0 5 0 0',
          store:store,
          searchURL:'/sms/search.json',
          listeners:{
            beforequery:function(){
              me.store.getProxy().extraParams = {};
            }
          }
        })
      ]
    });
    return tbar;
  },

  createBbar:function(store){
    var bbar = Ext.create('Ext.toolbar.Paging',{
      store:store,
      displayInfo:true
    });
    return bbar;
  },

  searchData:function(start_date, end_date, send_status){
    var me = this;
    var store = me.getStore();
    var proxy = store.getProxy();
    if(!Ext.isEmpty(start_date) && !Ext.isEmpty(end_date)){
      var dateutil = end_date.getDate()+1;
      end_date.setDate(dateutil);
      var started_at = Ext.Date.format(start_date,'Y-m-d H:i:s');
      var ended_at = Ext.Date.format(end_date,'Y-m-d H:i:s');
    }
    proxy.extraParams['started_at'] = started_at;
    proxy.extraParams['ended_at'] = ended_at;
    proxy.extraParams['status'] = send_status;
    store.getProxy().url =  "/sms/search.json";
    store.load();
  }

});