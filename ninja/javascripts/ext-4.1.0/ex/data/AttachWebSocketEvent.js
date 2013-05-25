Ext.define('Ext.ex.data.AttachWebSocketEvent', {
  attach: function(store) {
    var me = this;
    me.store = store;
    me.store.keyIndexMap = new Ext.util.HashMap();
    me.store.autoLoad    = false;
    me.store.autoSync    = false;
    //me.addEvents("recordupdate");
    var items = me.store.data.items;
    for(var i = 0; i < items.length; i++){
      me.store.keyIndexMap.add(items[i].getKey(), items[i].id);
    }
  },

  connect: function(url, events, data, wsListeners) {
    var me = this,
        listeners,
        websocket = Ext.ex.WebSocketManager.get(url);// || spawn();
    me.store.determineAction = function(record){
      return 'update';
    };
    if(!websocket){
      listeners = wsListeners || {};
      Ext.applyIf(listeners, {
        open  : function(ws){
          ws.send(events, data);
        },
        close : listeners.close || Ext.emptyFn,
        error : listeners.error || Ext.emptyFn,
        message: function(ws, message) {
          //console.log(message);
          if(message){
            var proxy     = me.store.getProxy();
            var resp      = Ext.JSON.decode(message);
            var result    = proxy.getReader().read(resp);
            var operation = Ext.create('Ext.data.Operation');
            Ext.apply(operation, {
              resultSet: result
            });
            operation.setCompleted();
            operation.setSuccessful();
            Ext.callback(me.onWsMessage, me.store, [operation, me]);
          }
        } 
      });
      websocket = Ext.create('Ext.ex.WebSocket', {
        url: url,
        listeners: listeners
      });

      Ext.ex.WebSocketManager.register(websocket);
    }else{
      websocket.send(events, data);
    }
    return websocket;
  },

  open:  Ext.emptyFn,
  close: Ext.emptyFn,
  error: Ext.emptyFn,
  
  onWsMessage: function(operation, cmp) {
    var me = cmp,
      store = this,
      i = 0,
      resultSet = operation.getResultSet(),
      records = operation.getRecords(),
      length = records.length,
      successful = operation.wasSuccessful();
      me.fireEvent('load', me, records, successful);
      for (; i < length; i++) {
        var record = records[i];
        var action = store.determineAction(record);
        switch (action) {
          case 'update':
            me.updateData(record, store);
            break;
          case 'purge':
            me.purge(record, store);
            break;
          default:
            Ext.global.console.warn('Ext.ex.data.StreamStore: can not handle action: ' + action);
        }
      }
  },

  updateData: function(record, store) {

    var me = this,
        j  = 0,
      index = -1;
    var items = store.data.items;
    var recordId = store.keyIndexMap.get(record.getKey());
    index = me.recordIndex(items, recordId);
    if (index > -1) {
        //store.removeAt(index);
        me.insertData(index, record, store);
    } else {
        me.insertData(store.data.length, record, store);
    }
    store.keyIndexMap.add(record.getKey(), record.id);
    //store.fireEvent('recordupdate', store, record, index);
  },

  insertData: function(index, records, store) {
    var me = store,
        sync = false,
        i,
        record,
        len;

    records = [].concat(records);
    for (i = 0,len = records.length; i < len; i++) {
      record = me.createModel(records[i]);
      record.set(me.modelDefaults);
      // reassign the model in the array in case it wasn't created yet
      records[i] = record;

      me.data.insert(index, record.getKey(), record);
      record.join(me);

      sync = sync || record.phantom === true;
    }

    if (me.requireSort) {
      // suspend events so the usual data changed events don't get fired.
      me.suspendEvents();
      me.sort();
      me.resumeEvents();
    }

    me.fireEvent('add', me, records, index);
    me.fireEvent('datachanged', me);
    if (me.autoSync && sync && !me.autoSyncSuspended) {
        me.sync();
    }
  },

  purge: function(records){
    if(!Ext.isArray(records)){
        records = [records];
    }
    var me = this,
        i = 0,
        j = 0,
        length = records.length,
        index = -1,
        record;

    for(; i < length; i++) {
        record = records[i];
        recordId = me.keyIndexMap.get(record.getKey());

        index = me.recordIndex(me.data.items, recordId);

        if(index > -1){
          me.removeAt(index);
        } 
    }
  },

  recordIndex: function(items, recordId){
    var index = -1,
        i = 0;
    for(; i < items.length; i++){
      if(items[i].id == recordId){
        index = i;
        break
      }
    }
    return index;
  }
});