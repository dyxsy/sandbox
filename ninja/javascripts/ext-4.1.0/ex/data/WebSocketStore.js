Ext.define('Ext.ex.data.WebSocketStore', {
    extend: 'Ext.ex.data.StreamStore',
    alias: 'store.websocket',
    requires: [
        'Ext.ex.data.proxy.WebSocket',
        'Ext.data.reader.Json',
        'Ext.data.writer.Json'
    ],

    constructor: function(config) {
      config = Ext.apply({
          proxy: {
              type : 'websocket',
              reader: 'json',
              writer: 'json'
          }}, config);

      this.callParent([config]);
    }

});