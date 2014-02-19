Ext.define('Ninja.window.TradesWindow',{
  extend:'Ext.window.Window',
  title:'历史成交记录查询',
  closeAction:'destroy',
  resizable:false,
  draggable:true,
  modal:true,
  width:1002,
  height:500,
  border:0,
  layout:'border',

  initComponent:function(){
    var me = this;
    me.gridPanel = Ext.create('Ninja.grid.TradesGrid2',{
      region:'center',
      title: '',
      isTab: true,
      multiSelect:true,
      width:1000,
      csvColumns: {'direction' : '买/卖', 'investor.login' : '帐号', 'offset' : '开/平',
        'vorh' : '投机/套保', 'instrument_code' : '合约', 'volume' : '成交数量', 'cost' : '成交价',
        'commission' : '手续费', 'close_profit' : '平仓盈亏', 'trade_time' : '交易时间'},
      csvValue: {'direction-1' : '买', 'direction-0' : '卖', 'offset-1': '开',
        'offset-2' : '平', 'vorh-1' : '投机', 'vorh-3' : '套保'},
      csvName: 'history_trades',
      tbar: me.createTbar(),
      plugins :[{ ptype : 'exportrecords', downloadButton : 'top' }],
      isWindow: true
    });

    me.items = [me.gridPanel];
    me.bbar = me.createBbar();
    me.callParent(arguments);
  },
  listeners:{
    afterrender:function(){
      var me = this;
      me.reqHistoryTrades();
    }
  },

  createBbar:function(){
    var me = this;
    var bbar = Ext.create('Ext.ux.StatusBar', {
            itemId: 'sbar',
            defaultText: '等待中..',
            defaultIconCls: 'default-icon',
            items: [
              "->",
              Ext.create('Ext.toolbar.TextItem', {text: '',itemId: 'tradesTotal'})
            ]
    });
    return bbar;
  },

  createTbar:function(){
    var me = this;
    var tbar = Ext.create('Ext.toolbar.Toolbar',{
      items:[
        {
          xtype:'datefield',
          itemId:'start_date',
          fieldLabel:'时间',
          width:148,
          labelWidth:33,
          editable:false,
          format:'Y-m-d',
          value:new Date(),
          maxValue:new Date(),
          listeners:{   
            select : function(cmp) {  
              var start = me.gridPanel.down("#start_date");
              var end = me.gridPanel.down("#end_date");
              var elapsed = Math.round((end.getValue() - start.getValue())/(86400000));
              end.setMinValue(start.getValue());
              var s = Ext.util.Format.date(start.getValue(), 'Y-m-d');
              var endEndDate = new Date(new Date(s).getTime() + (6*86400000));

              if(elapsed > 7) {
                end.setMaxValue(endEndDate);
                end.setValue(endEndDate); 
              }else if(elapsed < 0){
                if (endEndDate > new Date()) {
                  endEndDate = new Date();
                };
                end.setMaxValue(endEndDate);
                end.setValue(endEndDate);
              }else if(elapsed == 0){
                end.setMinValue(start.getValue());
                if (endEndDate > new Date()) {
                  endEndDate = new Date();
                };
                end.setMaxValue(endEndDate);
                end.setValue(endEndDate);
              };
            }      
          }  
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
          value: new Date(),
          maxValue: new Date(),
          minValue: new Date()
        },
        {
          text:'查询',
          itemId: 'tradesBtn',
          disabled: true,
          handler:function(){
            me.gridPanel.getStore().removeAll(false);
            me.reqHistoryTrades();
          }
        }
      ]
    });
    return tbar;
  },

  wrapRequestAndHolder: function(){
    var me = this;

    var startDate = Ext.Date.format(me.gridPanel.down("#start_date").getValue(), 'Y-m-d') + " 00:00:00";
    var endDate   = Ext.Date.format(me.gridPanel.down("#end_date").getValue(), 'Y-m-d') + " 23:59:59";

    me.count = 0;
    me.users = new Ext.util.HashMap();
    var outIds = [];
    for (var i = 0; i < me.investorRecords.length; i++) {
      var outId = me.investorRecords[i].get("out_id");
      var username = me.investorRecords[i].get("login");
      var userId = me.investorRecords[i].get("id");
      var ext = me.investorRecords[i].get("ext");
      me.users.add(outId, [username, userId, ext]);
      outIds.push(outId);
    };
    return [[startDate, endDate], outIds];
  },

  reqHistoryTrades:function(){
    var me = this;

    var arr = me.wrapRequestAndHolder();
    var dateRange = arr[0];
    var outIds = arr[1];
    me.count = outIds.length;
    var url = Ninja.App.socketBaseURI + 'admins/' + login.userId  + '/trades' ;
    var callbackId = (new Ext.data.UuidGenerator({})).generate();
    var websocket = Ext.ex.WebSocketManager.get(url);
    if(! websocket) {
      var listeners = {};
      Ext.applyIf(listeners, {
        open: function(ws) {
          ws.send("query", ["trades", callbackId]);
          var sb = me.down('#sbar');
          if (Ext.isEmpty(sb)) {
            return;
          };
          sb.showBusy({
            text: '正在查询..'
          });
          me.down('#tradesTotal').setText("");
          me.down('#tradesBtn').setDisabled(true);
          Ext.Ajax.request({
            url: '/investors/trades.json',
            method: 'GET',
            params:{
              'outIds':Ext.encode(outIds),
              'dateRange':Ext.encode(dateRange),
              'callbackId': callbackId
            },
            success: function(response){
            }
          });
        },
        close: listeners.close || Ext.emptyFn,
        error: listeners.error || Ext.emptyFn,
        message: function(ws, message) {
          if (message) {
            var resp = Ext.JSON.decode(message);
            me.responseDataHandle(resp);
          }
        }
      });

      websocket = Ext.create('Ext.ex.WebSocket', {
        url: url,
        listeners: listeners
      });
      // Ext.ex.WebSocketManager.register(websocket);
    };
  },

  responseDataHandle: function(resp){
    var me = this;
    var store = me.gridPanel.getStore();

    if (resp.data == "completed") {
      var sb = me.down('#sbar');
      if (Ext.isEmpty(sb)) {
        return;
      };
      sb.setStatus({
        text: '查询结束!',
        iconCls: 'x-status-valid',
      });
      me.down('#tradesTotal').setText("查询帐号共" + me.users.getCount() + "个,总共记录" + store.data.length + "条");
      me.down('#tradesBtn').setDisabled(false);
      return;
    };

    var trades  = Ext.JSON.decode(resp.data);
    var records = [];
    
    for (var j = 0; j < trades.length; j++) {
      hash = {};
      hash["investor.login"] = me.users.get(trades[j].investor_out_id)[0];
      hash["investor_id"] = trades[j].investor_id;
      hash["investor.ext"] = me.users.get(trades[j].investor_out_id)[2];
      hash["instrument_code"] = trades[j].instrument_code;
      hash["cost"] = trades[j].cost
      hash["volume"] = trades[j].volume
      hash["offset"] = trades[j].offset
      hash["direction"] = trades[j].direction
      hash["vorh"] = trades[j].vorh
      hash["commission"] = trades[j].commission
      hash["trade_time"] = trades[j].trade_time
      hash["trade_no"] = trades[j].trade_no

      var rec = Ext.create('Ninja.model.Trade', hash);
      records.push(rec);
    };
    store.add(records);
    me.gridPanel.getView().refresh();
    var sbt = me.down('#tradesTotal');
    if (Ext.isEmpty(sbt)) {
      return;
    };
    sbt.setText("已查询记录" + store.data.length + "条");
  }
});