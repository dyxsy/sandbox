/**
 *  NOTE: only support KeyModel now!
 *  
 *      Ext.define('User', {
 *          extend: 'Ext.ex.data.DomainKeyModel',
 *          fields: [
 *              {name: 'firstName', type: 'string'},
 *              {name: 'lastName',  type: 'string'},
 *              {name: 'age',       type: 'int'},
 *              {name: 'eyeColor',  type: 'string'}
 *          ]
 *      });
 *
 *      var myStore = Ext.create('Ext.data.Store', {
 *          model: 'User',
 *          proxy: {
 *              type: 'ajax',
 *              url: '/users.json',
 *              reader: {
 *                  type: 'websocket',
 *                  root: 'users'
 *              }
 *          },
 *          autoLoad: true
 *      });
 */
Ext.define('Ext.ex.data.StreamStore', {
  extend: 'Ext.data.Store',

  alias: 'store.streamstore',

  requires: ['Ext.util.HashMap'],

  autoLoad : false,
  autoSync : false,
  remoteSort: false,

  // var store = Ext.state.LocalStorageProvider.create(); 
  // store.set('record',rec);
  // store.get()
  keyIndexMap: new Ext.util.HashMap(), 

  statics: {
    recordIdFn: function(record) {
        return record.getKey() || record.internalId;
    }
  },
  /**
   * Crete the store
   */
  constructor: function(config) {
    this.callParent([config]);
  },

  /**
   *
   */
  connect: function(options) {
    var me = this;
    me.load(options);
  },

  /**
   *
   */
  load: function(options) {
    var me = this,
        operation;
    options = options || {};
    Ext.applyIf(options, {
      action : options.action || 'connect',
      filters: me.filters.items,
      sorters: me.getSorters()
    });
    
    operation = Ext.create('Ext.data.Operation', options);

    if (me.fireEvent('beforeload', me, operation) !== false) {
        me.loading = true;
        me.proxy.read(operation, me.onWsMessage, me);
    }  
    return me;
  },

  send: function(wsEvents, data, options) {
    var me = this,
        operation,
        events = [].concat(wsEvents);

    options = options || {};
    Ext.applyIf(options, {
      action     : options.action || 'send',
      wsEvents   : events,
      data       : data
    });

    operation = Ext.create('Ext.data.Operation', options);
    me.proxy.read(operation, me.onWsSend, me);
     
    return me;
  },

  onWsSend: function(){

  },

  onWsMessage: function(operation) {
    var me = this,
      i = 0,

      resultSet = operation.getResultSet(),
      records = operation.getRecords(),
      length = records.length,
      successful = operation.wasSuccessful();
      me.fireEvent('load', me, records, successful);
      for (; i < length; i++) {
        var record = records[i];
        var action = me.determineAction(record);
        switch (action) {
          case 'update': 
            me.update(record);
            break;
          case 'purge':
            me.purge(record);
            break;
          default:
            Ext.global.console.warn('Ext.ex.data.StreamStore: can not handle action: ' + action);
        }
      }
      
  },
  
  determineAction: function(record) {
    return 'update';
  },

  update: function(record) {
    var me = this,
        j  = 0,
      index = -1;

    recordId = me.keyIndexMap.get(record.getKey());
    index = me.record_index(me.data.items, recordId);

    if (index > -1) {
        //me.removeAt(index); // don't uncomment the line in case of 100% cpu usage!
        me.fireEvent('remove', me, record, index);
        me.insert(index, record);
        me.keyIndexMap.add(record.getKey(), record.id);
    } else {
        me.insert(me.data.length, record);
        me.keyIndexMap.add(record.getKey(), record.id);
    }
  },

  insert: function(index, records) {
    var me = this,
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

    //if (me.snapshot) {
    //  me.snapshot.addAll(records);
    //}

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

        index = me.record_index(me.data.items, recordId);

        if(index > -1){
          me.removeAt(index);
        } 
    }
  },
  
  record_index: function(items, recordId){
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