/**
 *
 *
 */
Ext.define('Ext.ex.data.proxy.WebSocket', {
  requires: [],
  extend: 'Ext.data.proxy.Server',
  alias: 'proxy.websocket',
  alternateClassName: ['Ext.ex.data.proxy.WebSocket', 'Ext.data.WebSocketProxy'],

  actionMethods: {
    connect : 'CONNECT',
    send    : 'SEND',
    close   : 'CLOSE'
  },

  constructor : function(config) {
    this.callParent([config]);
  },

  doRequest: function(operation, callback, scope) {
    var me = this,
        writer  = me.getWriter(),
        request = me.buildRequest(operation, callback, scope);

    //if (operation.allowWrite()) {
    //  request = writer.write(request);
    //}
    Ext.apply(request, {
        headers       : me.headers,
        timeout       : me.timeout,
        scope         : me,
        store         : scope,
        callback      : callback,
        wsListeners   : operation.wsListeners,
        wsEvents      : operation.wsEvents,
        data          : operation.data,
        method        : me.getMethod(request),
        disableCaching: false // explicitly set it to false, ServerProxy handles caching
    });
    
    Ext.ex.WebSocketManager.request(request);
    
    return request;
  },

  /**
   *
   */
  getMethod: function(request) {
    var me = this;
    return me.actionMethods[request.action];
  },

  /**
   *
   */
  buildUrl: function(request) {
    var me = this,
        url = me.getUrl(request);

    if (!url) {
      return undefined;
    }

    if (me.noCache) {
        url = Ext.urlAppend(url, Ext.String.format("{0}={1}", me.cacheString, Ext.Date.now()));
    }

    return url;
  },
  
  clear: Ext.emptyFn
});