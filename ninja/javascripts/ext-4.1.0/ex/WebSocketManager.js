/**
 * @class Ext.ux.WebSocketManager
 * @author Vincenzo Ferrari <wilk3ert@gmail.com>
 * @singleton
 * 
 * Manager of Ext.ux.WebSocket
 * 
 * This singleton provide some useful functions to use for many websockets.
 * 
 *     var ws1 = Ext.create ('Ext.ux.WebSocket', {
 *       url: 'ws://localhost:8888'
 *     });
 *     
 *     Ext.ux.WebSocketManager.register (ws1);
 *     
 *     var ws2 = Ext.create ('Ext.ux.WebSocket', {
 *       url: 'ws://localhost:8900'
 *     });
 *     
 *     Ext.ux.WebSocketManager.register (ws2);
 *     
 *     var ws3 = Ext.create ('Ext.ux.WebSocket', {
 *       url: 'ws://localhost:8950'
 *     });
 *     
 *     Ext.ux.WebSocketManager.register (ws3);
 *     
 *     Ext.ux.WebSocketManager.listen ('system shutdown', function (ws, data) {
 *       Ext.Msg.show ({
 *         title: 'System Shutdown' ,
 *         msg: data ,
 *         icon: Ext.Msg.WARNING ,
 *         buttons: Ext.Msg.OK
 *       });
 *     });
 *     
 *     Ext.ux.WebSocketManager.broadcast ('system shutdown', 'BROADCAST: the system will shutdown in few minutes.');
 *     
 *     Ext.ux.WebSocketManager.closeAll ();
 *     
 *     Ext.ux.WebSocketManager.unregister (ws1);
 *     Ext.ux.WebSocketManager.unregister (ws2);
 *     Ext.ux.WebSocketManager.unregister (ws3);
 */
Ext.define('Ext.ex.WebSocketManager', {
  singleton: true,

  /**
   * randParamters will be ignored in normalizing url
   */
  randParameters: [],

  /**
   * @property {Ext.util.HashMap} wsList
   * @private
   */
  wsList: Ext.create('Ext.util.HashMap'),

  /**
   * @method register
   * Registers one or more Ext.ux.WebSocket
   * @param {Ext.ux.WebSocket/Ext.ux.WebSocket[]} websockets WebSockets to register. Could be only one.
   */
  register: function(websockets) {
    var me = this;

    // Changes websockets into an array in every case
    if (Ext.isObject(websockets)) websockets = [websockets];

    Ext.each(websockets, function(websocket) {
      if (!Ext.isEmpty(websocket.url)) {
        me.wsList.add(me.normalize(websocket.url), websocket);
      }
    });
  },

  /**
   * @method contains
   * Checks if a websocket is already registered or not
   * @param {Ext.ux.WebSocket} websocket The WebSocket to find
   * @return {Boolean} True if the websocket is already registered, False otherwise
   */
  contains: function(websocket) {
    var me = this;
    return me.wsList.containsKey(websocket.url);
  },

  /**
   * @method get
   * Retrieves a registered websocket by its url
   * @param {String} url The url of the websocket to search
   * @return {Ext.ux.WebSocket} The websocket or undefined
   */
  get: function(url) {
    var me = this;
    return me.wsList.get(me.normalize(url));
  },

  /**
   * @method each
   * Executes a function for each registered websocket
   * @param {Function} fn The function to execute
   */
  each: function(fn) {
    var me = this;
    me.wsList.each(function(url, websocket, len) {
      fn(websocket);
    });
  },

  /**
   * @method unregister
   * Unregisters one or more Ext.ux.WebSocket
   * @param {Ext.ux.WebSocket/Ext.ux.WebSocket[]} websockets WebSockets to unregister
   */
  unregister: function(websockets) {
    var me = this;

    if (Ext.isObject(websockets)) websockets = [websockets];

    Ext.each(websockets, function(websocket) {
      if (me.wsList.containsKey(websocket.url)) me.wsList.removeAtKey(websocket.url);
    });
  },

  /**
   * @method broadcast
   * Sends a message to each websocket
   * @param {String} event The event to raise
   * @param {String/Object} message The data to send
   */
  broadcast: function(event, message) {
    this.multicast([], event, message);
  },

  /**
   * @method multicast
   * Sends a message to each websocket, except those specified
   * @param {Ext.ux.WebSocket/Ext.ux.WebSocket[]} websockets An array of websockets to take off the communication
   * @param {String} event The event to raise
   * @param {String/Object} data The data to send
   */
  multicast: function(websockets, event, data) {
    this.getExcept(websockets).each(function(url, websocket, len) {
      if (websocket.isReady()) {
        if (Ext.isEmpty(data)) websocket.send(event);
        else websocket.send(event, data);
      }
    });
  },

  /**
   * @method listen
   * Adds an handler for events given to each registered websocket
   * @param {String/String[]} events Events to listen
   * @param {Function} handler The events' handler
   */
  listen: function(events, handler) {
    if (Ext.isString(events)) events = [events];

    this.wsList.each(function(url, websocket, len) {
      Ext.each(events, function(event) {
        websocket.on(event, handler);
      });
    });
  },

  /**
   * @method listenExcept
   * Adds an handler for events given to each registered websocket, except websockets given
   * @param {String/String[]} events Events to listen
   * @param {Ext.ux.WebSocket/Ext.ux.WebSocket[]} websockets WebSockets to exclude
   * @param {Function} handler The events' handler
   */
  listenExcept: function(events, websockets, handler) {
    if (Ext.isString(events)) events = [events];

    this.getExcept(websockets).each(function(url, websocket, len) {
      Ext.each(events, function(event) {
        websocket.on(event, handler);
      });
    });
  },

  /**
   * @method getExcept
   * Retrieves registered websockets except the input
   * @param {Ext.ux.WebSocket/Ext.ux.WebSocket[]} websockets WebSockets to exclude
   * @return {Ext.util.HashMap} Registered websockets except the input
   * @private
   */
  getExcept: function(websockets) {
    if (Ext.isObject(websockets)) websockets = [websockets];

    var list = this.wsList.clone();

    // Exclude websockets from the communication
    Ext.each(websockets, function(websocket) {
      list.removeAtKey(websocket.url);
    });

    return list;
  },

  /**
   * @method closeAll
   * Closes any registered websocket
   */
  closeAll: function() {
    var me = this;

    me.wsList.each(function(url, websocket, len) {
      websocket.close();
      me.unregister(websocket);
    });
  },

  request: function(request){
    var me = this,
        websocket;

    //console.log("websocket request (mothod=" + request.method + 
    //            ",url=" + request.url + ")");    
    switch( request.method ) {
        case 'CONNECT':
            websocket = me.get(request.url) || me.spawn(request);
            break;
        case 'SEND':
            websocket = me.get(request.url);
            websocket.send(request.wsEvents, request.data);
            break;
        case 'CLOSE':
            websocket = me.get(request.url);
            websocket.close();    
        default:
            ; // nothing    
    }
    
  },

  /**
   *
   */
  spawn: function(request){
    var me = this,
        listeners,
        websocket;
        
    listeners = request.wsListeners || {},
    Ext.applyIf(listeners, {
      open  : listeners.open || Ext.emptyFn,
      close : listeners.close || Ext.emptyFn,
      error : listeners.error || Ext.emptyFn,
      message: function (ws, message) {
        if(message){
          var proxy     = request.proxy;
          var operation = request.operation;
          var resp      = Ext.JSON.decode(message);
          var result    = proxy.getReader().read(resp);
          Ext.apply(operation, {
            resultSet: result
          });
          operation.setCompleted();
          operation.setSuccessful();
          Ext.callback(request.callback, request.store, [operation]);
        }
      }
    });

    websocket = Ext.create ('Ext.ex.WebSocket', {
      url: request.url,
      listeners: listeners
    });

    me.register(websocket);
    return websocket;
  },

  /**
   *
   */
  getByRequest : function(request) {
    var me = this,
        websocket;
    
    websocket = me.get(request.url);
    listeners = request.wsListeners || {},
    websocket.on("open",   (listeners.open || Ext.emptyFn));
    websocket.on("close",  (listeners.close || Ext.emptyFn));
    websocket.on("error",  (listeners.error || Ext.emptyFn));
    websocket.on("message", function (ws, message) {
                              if(message){
                                var proxy     = request.proxy;
                                var operation = request.operation;
                                var resp      = Ext.JSON.decode(message);
                                var result    = proxy.getReader().read(resp);
                                Ext.apply(operation, {
                                  resultSet: result
                                });
                                operation.setCompleted();
                                operation.setSuccessful();
                                Ext.callback(request.callback, request.store, [operation]);
                              }

                              if (Ext.isObject(message)) {
                                var msg = Ext.JSON.decode(message.data);
                                websocket.fireEvent(msg.event, websocket, msg.data);
                              }
                          });
    return websocket;
  },

  /**
   *
   */    
  normalize: function(url){
    var me = this,
        pos = url.indexOf('?');

    if( pos > -1 ) {
      var base = url.substring(0, pos);
      var queryStr  = url.substring(pos + 1);
      var queryStr2 = "";

      Ext.each(queryStr.split("&"), function(item) {
        keyValue = item.split("=");
        key = keyValue[0];
        if (Ext.Array.contains(me.randParameters, key)) {
          // ignore the key
        } else {
          queryStr2 = queryStr2 + "&" + item;
        }
      });

      return (queryStr2 == "" ? base : base + "?" + queryStr2);
    } else {
      return url;
    }
  }

});