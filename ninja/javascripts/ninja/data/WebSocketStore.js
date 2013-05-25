/**
 *  var store = Ext.create('Ninja.data.WebSocketStore', {
 *    baseUrl : 'ws://192.168.1.23/investor/',
 *    model: 'Trade',
 *    proxy: {
 *      reader: {
 *        type: 'json',
 *        root: 'trades'
 *      }
 *  }
 * 
 *  store.subscribe(anthoerInvestor)
 *
 *
 */
Ext.define('Ninja.data.WebSocketStore', {
  extend: 'Ext.ex.data.WebSocketStore',
  alias: 'ninja.store.websocket',
  requires: [
    'Ext.ex.data.WebSocketStore',
    'Ext.ex.data.proxy.WebSocket',
    'Ext.data.reader.Json',
    'Ext.data.writer.Json'
  ],

  baseUrl: undefined,
  investor: undefined,

  constructor: function(config) {
    config = Ext.apply({
      proxy: {
          type : 'websocket',
          reader: 'json',
          writer: 'json'
      }}, config);

    this.callParent([config]);
  },

  subscribe: function(investor, Data, options) {
    var me = this,
        url = me.websocketUrl(investor),
        websocket = Ext.ex.WebSocketManager.get(url);

    if(me.investor && me.investor != investor) {
      //me.unsubscribe(me.investor, Data);
      me.removeAll();
    }
    options = options || {};
    Ext.applyIf(options, {
      url : url,
      wsListeners: {
          open: function (ws) {
            ws.send ('subscribe', Data);
          }
        }
    });

    if( websocket ) {
      me.send('subscribe', Data, options);
    } else {
      me.connect(options);
    }

    me.investor = investor;
  },

  unsubscribe: function(investor, Data, options) {
    var me = this;
    
    investor = investor || me.investor;
    options = options || {};
    
    Ext.applyIf(options, {
      url : me.websocketUrl(investor)
    });
    //me.removeAll();
    me.send('unsubscribe', Data, options);
  },

  websocketUrl: function(investor) {
    var me = this;
    return Ext.String.format(me.baseUrl, investor);
  }

});