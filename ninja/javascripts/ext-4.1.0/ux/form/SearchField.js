Ext.define('Ext.ux.form.SearchField', {
    extend: 'Ext.form.field.Trigger',
    
    alias: 'widget.searchfield',
    
    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
    
    trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
    
    hasSearch : false,
    paramName : 'query',
    
    initComponent: function() {
        var me = this;

        me.callParent(arguments);
        me.on('specialkey', function(f, e){
            if (e.getKey() == e.ENTER) {
                me.onTrigger2Click();
            }
        });
        me.addEvents('beforequery');
    },
    
    afterRender: function(){
        this.callParent();
        this.triggerCell.item(0).setDisplayed(false);
        this.updateLayout();
    },
    
    onTrigger1Click : function(){
        var me = this,
          store = me.store,
          proxy = store.getProxy();  
        if (me.hasSearch) {
            if (me.searchURL) {
              if(me.url){
                //处理 帐号列表 清除搜索输入框时查询所有的帐号 ，这里只查询出选中的公司对应的帐号
                proxy.api.read ? proxy.api.read = me.url : proxy.url = me.url; 
              }else{
                proxy.api.read ? proxy.api.read = me.searchURL : proxy.url = me.searchURL;  // update
              }
            }
            me.setValue('');
            proxy.extraParams[me.paramName] = '';
            me.fireEvent('beforequery', me, "");
            store.loadPage(1);
            me.hasSearch = false;
            me.triggerCell.item(0).setDisplayed(false);
            me.updateLayout();
        }
    },

    onTrigger2Click : function(){
        var me = this,
            store = me.store,
            proxy = store.getProxy(),
            value = me.getValue();
        if (me.searchURL) {
          proxy.api.read ? proxy.api.read = me.searchURL : proxy.url = me.searchURL;  // update
        }

        if (value.length > 0) {
            // Param name is ignored here since we use custom encoding in the proxy.
            // id is used by the Store to replace any previous filter
            me.fireEvent('beforequery', me, value);
            proxy.extraParams[me.paramName] = value;
            store.loadPage(1);
            me.hasSearch = true;
            me.triggerCell.item(0).setDisplayed(true);
            me.updateLayout();
        }else{
          me.onTrigger1Click();
          return;
        }
    }
});