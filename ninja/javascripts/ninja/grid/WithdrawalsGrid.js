Ext.define("Ninja.grid.WithdrawalsGrid",{
  extend : "Ext.grid.Panel",
  border:0,
  columnLines: true,
  title: "出金列表",
  enableColumnMove: false,
  enableColumnHide:false,
  multiSelect:true,
  viewConfig: {
    stripeRows: true
  },
  initComponent:function(){
    var store = this.createStore();
    var columns = this.createColumns();
    Ext.apply(this,{
      columns: columns,
      store: store,
      bbar: this.createBbar(store),
      tbar: this.createTbar(store)
    });
    this.callParent(arguments);
  },
  listeners:{
    afterrender:function(cmp){
      cmp.requestInterval = 30000;
      cmp.task = {
        run: function(){
          var store = cmp.getStore();
          var proxy = store.getProxy();
          proxy.url = '/withdrawals/get.json';
          store.load();
        },
        interval: cmp.requestInterval //请求间隔时间
      }
      cmp.refresh();
      cmp.buildTask(cmp.requestInterval/1000);
    },
    hide:function(cmp){
      cmp.stopRefresh();
      cmp.runner.stop(cmp.clockTask);
    },
    show:function(cmp){
      var refreshValue = cmp.down('#autoRefresh').getValue();
      if(refreshValue != "stop"){
        cmp.stopRefresh();
        var interval = Ext.Number.from(refreshValue, 30000);
        cmp.task.interval = interval;
        cmp.refresh();
        cmp.reconfigure(interval/1000);
      }
    },
    destroy:function(cmp){
      if (cmp.runner != undefined) {
        cmp.stopRefresh();
        cmp.runner.stop(cmp.clockTask);
      }
    }
  },
  
  /*
  * 创建列
  */
  createColumns:function(){
    var columns = {
      defaults:{
        sortable: true,
        align: "left"
      },
      items:[
        { xtype: 'rownumberer',width: 30,sortable: false},
        { header: "帐号",    dataIndex:"login", flex: 1 },
        { header: "创建时间",    dataIndex: "created_at", flex: 1, xtype: 'datecolumn', format:"Y-m-d H:i:s"},
        { header: "处理时间",    dataIndex: "updated_at", flex: 1, xtype: 'datecolumn',
          renderer: function(value,meds,record){
            if (record.data['status'] == null) {
               return '';
            }else{
              var updated_at = new Date(value);
              return Ext.Date.format(updated_at,'Y-m-d H:i:s');
            }
          }
        },
        { header: "开户银行", dataIndex: "bank", flex: 1,
          renderer: function(value){
            if(!Ext.isEmpty(value)){
              var bankAccount = value.split("-");
              switch (bankAccount[0]) {
                case "ICBC"   : return "中国工商银行-" + bankAccount[1];
                case "CMBC"   : return "招商银行-" + bankAccount[1];
                case "CCB"    : return "中国建设银行-" + bankAccount[1];
                case "ABC"    : return "中国农业银行-" + bankAccount[1];
                case "BOC"    : return "中国银行-" + bankAccount[1];
                case "BOCOM"  : return "交通银行-" + bankAccount[1];
                case "HXB"    : return "华夏银行-" + bankAccount[1];
                case "CIB"    : return "兴业银行-" + bankAccount[1];
                case "CMSB"   : return "中国民生银行(卡)-" + bankAccount[1];
                case "CMSB_2" : return "中国民生银行(网银)-" + bankAccount[1];
                case "GDB"    : return "广发银行-" + bankAccount[1];
                case "PAB"    : return "平安银行-" + bankAccount[1];
                case "SHDB"   : return "上海浦东发展银行-" + bankAccount[1];
                case "ZXB"    : return "中信银行-" + bankAccount[1];
                case "CEB"    : return "中国光大银行-" + bankAccount[1];
                case "UP"     : return "银联-" + bankAccount[1];
                default      : value;
              };
            }
            return "";
          }
        },
        { header: "银行帐号", dataIndex: "bank_account", flex: 1},
        { header: "出金原因", dataIndex: "objective", flex: 1},
        { header: "状态---出金情况",    
          dataIndex: "status",       
          flex: 1,
          renderer: function(value,meta){
            if(value == null){
              meta.style += "color:red;";
              return "未处理--未出金";
            }
            if (value == 0) {
              meta.style += "color:green;";
              return "已处理--<font style=\"color:red\">未出金</font>";
            }
            if (value == 1){
              meta.style += "color:green;";
              return "已处理--已出金";
            }
            
          }
        }, 
        { header: "备注", dataIndex: "comment", flex: 1}
      ]
    };
    return columns;
  },
  
  createStore: function(){
    var me = this;
    me.store = Ext.create('Ext.data.Store', {
      fields:[
        {name: 'id'},
        {name: 'login'},
        {name: 'created_at'},
        {name: 'updated_at'},
        {name: 'bank'},
        {name: 'bank_account'},
        {name: 'status'},
        {name: 'comment'},
        {name: 'objective'}
      ],
      proxy: {
        type: 'ajax',
        url: '/withdrawals/get.json',
        reader: {
          type: 'json',
          root: 'records'
        },
        simpleSortMode: true
      },
      sorters: [{
        property: 'updated_at',
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
    var me = this;
    var tbar = Ext.create('Ext.toolbar.Toolbar',{
      items:[
        {
          text:'处理',
          margin:'5 10 0 0',
          handler:function(){
            var records = me.getSelectionModel().getSelection();
            if (records.length <= 0){
                  Ext.Msg.alert('提示','至少选择一条出金记录');
                  return;
              }
            var withdrawal_ids = [];
            for (var i = records.length - 1; i >= 0; i--) {
              if (records[i].get('status') != null) {
                Ext.Msg.alert('提示','所选出金记录包含已处理记录，请重新选择');
                return;
              }
              withdrawal_ids.push(records[i].get('id'));
            }

            Ext.create('Ext.window.Window',{
              itemId:'withdrawals_win',
              title:'请选择客户是否已出金',
              closeAction:'destroy',
              resizable:false,
              draggable:true,
              modal:true,
              height:195,
              width:350,
              border:0,
              layout:'fit',
              items : [
                    Ext.create('Ext.form.Panel',{
                        border:false,
                        frame:true,
                        margin:'0 0 0 0',
                        items:[
                        {
                            xtype:'combo',
                            itemId:'withdrawals_select',
                            fieldLabel:'处理方式',
                            labelWidth:64,
                            width:180,
                            editable:false,
                            displayField:'name',
                            valueField:'value',
                            value:'1',
                            margin:'10 0 0 23',
                            store:Ext.create('Ext.data.Store',{
                              fields:['name','value'],
                              data:[
                                {name:'已出金',value:'1'},
                                {name:'未出金',value:'0'}
                              ]
                            })
                        },{
                          xtype:'textarea',
                          itemId:'withdrawals_comment',
                          fieldLabel:'备注',
                          labelWidth:41,
                          anchor:'90%',
                          margin:'10 0 0 46'
                        }]
                    })
                ],
                buttons: [{
                          text:'处理',
                          handler:function(){
                            var withdrawals_select = Ext.ComponentQuery.query("#withdrawals_select")[0].getValue();
                            var withdrawals_comment = Ext.ComponentQuery.query("#withdrawals_comment")[0].getValue();
                                me.handleWithdrawals(withdrawal_ids,withdrawals_select,withdrawals_comment);
                            var withdrawals_win = Ext.ComponentQuery.query("#withdrawals_win")[0];
                            withdrawals_win.close();
                          }
                        },
                        {
                          text:'取消',
                          handler:function(){
                            var withdrawals_win = Ext.ComponentQuery.query("#withdrawals_win")[0];
                            withdrawals_win.close();
                          }
                        }]
            }).show();
          }
        },
        {
          xtype:'datefield',
          itemId:'start_date',
          fieldLabel:'时间',
          width:148,
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
          width:110,
          format:'Y-m-d',
          value:new Date(),
          maxValue:new Date()
        },
        {
          xtype:'combo',
          margin:'0 0 0 15',
          itemId:'treated_status',
          fieldLabel:'处理状态',
          labelWidth:62,
          width:173,
          editable:false,
          displayField:'name',
          valueField:'value',
          value:'4',
          store:Ext.create('Ext.data.Store',{
            fields:['name','value'],
            data:[
              {name:'全部',value:'4'},
              {name:'未处理',value:'0'},
              {name:'已处理',value:'1'},
              {name:'已处理-已出金',value:'2'},
              {name:'已处理-未出金',value:'3'}
            ]
          })
        },
        {
          text:'查询',
          handler:function(){
            var start_date = me.down("#start_date").getValue();
            var end_date   = me.down("#end_date").getValue();
            var treated_status = me.down("#treated_status").getValue();
            me.searchDate(start_date, end_date, treated_status);
          }
        },
        {
          xtype:'combo',
          itemId:'autoRefresh',
          margin:'0 0 0 15',
          fieldLabel:'刷新设置',
          labelWidth:60,
          width:160,
          editable:false,
          displayField:'name',
          valueField:'value',
          value:'30000',
          store:Ext.create('Ext.data.Store',{
            fields:['name','value'],
            data:[
              {name:'手动刷新',value:'stop'},
              {name:'30秒',value:'30000'},
              {name:'1分钟',value:'60000'},
              {name:'2分钟',value:'120000'},
              {name:'3分钟',value:'180000'},
              {name:'4分钟',value:'240000'},
              {name:'5分钟',value:'300000'},
              {name:'10分钟',value:'600000'},
              {name:'15分钟',value:'900000'},
              {name:'20分钟',value:'1200000'}
            ]
          }),
          listeners:{
            change:function(cmp, newValue, oldValue){
              if(newValue == "stop"){
                me.stopRefresh();
                me.runner.stop(me.clockTask);
                me.down("#countdown").setText('');
                store.getProxy().url = "/withdrawals/get.json";
                store.load();
              }else{
                me.stopRefresh();
                var interval = Ext.Number.from(newValue, 30000);
                me.task.interval = interval;
                me.refresh();
                me.reconfigure(interval/1000);
              }
            }
          }
        },
        {
          xtype:'label',
          margin:'0 0 0 5',
          itemId:'countdown'
        },
        "->",
        Ext.create('Ext.ux.form.SearchField', {
          fieldLabel: '搜索',
          labelWidth: 35,
          width: 200,
          margin: '0 5 0 0',
          store: store,
          searchURL:'/withdrawals/search.json'
        })
      ]
    });
    return tbar;
  },

  /*
  * 出金请求处理
  */
  handleWithdrawals:function(withdrawal_ids,status,comment){
    var me = this;
    Ext.Ajax.request({
      url:'/withdrawals/modify.json',
      method:'POST',
      params:{
        'withdrawal_ids': Ext.encode(withdrawal_ids),
        'status'        : status,
        'comment'       : comment
      },
      success:function(response){
        var text = Ext.JSON.decode(response.responseText);
        if (text && text != "") {
          if (text.success) {
            me.store.load();
            Ext.create('Ninja.window.NotificationWindow',{
              html:"处理成功"
            }).show();
          }else{
            Ext.create('Ninja.window.NotificationWindow',{
              html:"处理失败",
              iconCls:'ux-notification-icon-error'
            }).show;
          }
        }else{
            Ext.create('Ninja.window.NotificationWindow',{
              html:"处理失败",
              iconCls:'ux-notification-icon-error'
        }).show;
        }
      }
    });
  },
  /*
  * 过滤查询
  */
  searchDate:function(start_date,end_date,status){
    var me = this;
    var store = me.getStore();
    var proxy = store.getProxy();
    if (!Ext.isEmpty(start_date) && !Ext.isEmpty(end_date)) {
      var dateutil = end_date.getDate()+1;
      end_date.setDate(dateutil);
      var started_at = Ext.Date.format(start_date,'Y-m-d H:i:s');
      var ended_at = Ext.Date.format(end_date,'Y-m-d H:i:s');
    }
    proxy.extraParams['started_at'] = started_at;
    proxy.extraParams['ended_at'] = ended_at;
    proxy.extraParams['status'] = status;
    store.getProxy().url = '/withdrawals/search.json';
    store.load();
  },

  refresh: function(){
    Ext.TaskManager.start(this.task);
  },

  stopRefresh: function(){
    Ext.TaskManager.stopAll();
  },

  buildTask: function(countDown){
    var me = this;
    me.runner = new Ext.util.TaskRunner();
    me.clockTask = {
      countDown:countDown,
      refreshInterval:countDown,
      interval:1000,
      scope:me,
      run:function(){
        me.clockTask.countDown--;
        if(me.clockTask.countDown < 0){
          me.clockTask.countDown = me.clockTask.refreshInterval-1;
        }
        me.refreshCountDown(me.clockTask.countDown);
      }
    }
    me.runner.start(me.clockTask);
  },

  reconfigure: function(value){
    var me = this;
    me.runner.stop(me.clockTask);
    me.clockTask.refreshInterval = value;
    me.clockTask.countDown = value;
    me.runner.start(me.clockTask);
  },

  refreshCountDown: function(countDown){
    var me = this; re
    var text;
    if(countDown > 60){
      var minutes = Math.floor(countDown/60);
      var seconds = countDown%60;
      text = "还有" + minutes + "分" + seconds + "秒开始刷新";
    }else{
      text = "还有" + countDown + "秒开始刷新";
    }
    me.down("#countdown").setText(text);
  }
});