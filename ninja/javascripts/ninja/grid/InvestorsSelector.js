Ext.define('Ninja.grid.InvestorsSelector', {
  extend: 'Ext.grid.Panel',
  //border: 0,
  loadMask: true,
  columnLines: true,
  enableColumnMove: true,
  multiSelect:true,
  viewConfig: {
    style: { overflow: 'auto', overflowX: 'hidden' }
  },
  initComponent: function(){
    var me  = this,
   
    store   = me.createStore(),
    columns = me.createColumns(),
    tbar    = me.createTbar(store);
    
    Ext.apply(me, {
      columns: columns,
      store: store,
      tbar: tbar
    }); 
    me.callParent(arguments); 
  },

  createColumns: function(){
    var columns = {
      defaults:{
        sortable:true,
        align:"center"
      },
      items:[
        //{xtype:'rownumberer', width:30, sortable:false},
        {text:'帐号', dataIndex:'login', flex:1},
        {text:'姓名', dataIndex:'name', flex:1}
      ]};
    return columns;
  },
  
  createStore: function(){
    var me = this;
    me.store = Ext.create('Ext.data.Store',{
      fields:[{name: 'login'}, {name: 'name'}],
      buffered: true,
      remoteSort: true,
      pageSize: 50,
      autoLoad: true,
      proxy:{
        type: 'jsonp',
        url: '/investors/select.json',
        reader:{
          root: "records",
          totalProperty: "totalCount"
        },
        simpleSortMode: true
      },
      listeners:{
        beforeLoad:function(ds){
          ds.removeAll(false);
        }
      }
    });
    return me.store;
  },

  createTbar:function(store){
    var tbar = Ext.create('Ext.toolbar.Toolbar',{
      items:[
        "->",
        Ext.create('Ext.ux.form.SearchField', {
          fieldLabel:'搜索',
          labelWidth:35,
          width:240,
          margin:'0 5 0 0',
          store:store,
          searchURL:'/investors/search.json',
          listeners:{
            change:function(cmp){
              cmp.onTrigger2Click();
            }
          }
        })
      ]
    });
    return tbar;
  }
  
});