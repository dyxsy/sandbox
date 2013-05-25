Ext.define('Ext.ux.menu.StoreMenuStore', {
  extend: 'Ext.data.Store',
  fields: [ 'id', 'text', 'iconCls' ],
  autoLoad: true,
  proxy: {
    type: 'ajax',
    url: undefined,
    reader: {
      type: 'json',
      root: 'records'
    }
  }
});

Ext.define('Ext.ux.menu.StoreMenu', {
  extend: 'Ext.menu.Menu',

  statics: {
    handlerMap: {},
    addHandler: function(key, fn){
      if(Ext.isString(key)){
        this.handlerMap[key] = fn;
      }else if(Ext.isObject(key)){
        Ext.apply(this.handlerMap, key);
      }
    },
    getHandler: function(key){
      return this.handlerMap[key] || Ext.emptyFn;
    },
    removeHandler: function(key){
      this.handlerMap[key] = undefined;
    },
    clearHandler: function(){
      this.handlerMap = {};
    }
  },

  url: undefined,
  store: undefined,
  isAlawyLoad: false,
  isLoaded: false,
  loadingText: 'Loading...',

  initComponent: function(){
    var me = this;
    me.callParent(arguments);

    me.loadingItem = {
      text: me.loadingText,
      iconCls: 'menu-loading-icon'
    };

    if(me.store){
        me.store = Ext.create('Ext.ux.menu.StoreMenuStore', me.store);
    }else{
        me.store = Ext.create('Ext.ux.menu.StoreMenuStore');
        me.store.getProxy().url = me.url;
    }

    me.on('show', me.onMenuLoad);
    listeners = {
      scope: me,
      beforeload: me.onBeforeLoad,
      load: me.onLoad
    };
    me.mon(me.store, listeners);
  },

  onMenuLoad: function(){
    if(this.isAlawyLoad){
      this.store.load();
    }else{
      if(!this.isLoaded){
        this.store.load();
      }
    }
  },

  onBeforeLoad: function(store){
    this.updateMenuItems(false);
  },

  onLoad: function(store, records){
    this.updateMenuItems(true, records);
  },

  updateMenuItems: function(state, records){
    var me = this;
    me.deactivateActiveItem();
    me.removeAll();
    if(state){
      var menuItem;
      Ext.each(records, function(item){
        menuItem = item.raw;
        if(menuItem.id){
          menuItem.handler = me.self.getHandler(menuItem.id);
        }
        me.add(menuItem);
      });
    }
    else{
      me.add(me.loadingItem);
    }
    me.isLoaded = state;
  }
});
