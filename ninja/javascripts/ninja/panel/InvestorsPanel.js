Ext.define('Ninja.panel.InvestorsPanel',{
  extend:'Ext.panel.Panel',
  border:false,
  layout:'fit',
  initComponent: function(){
    var investorsGrid = Ext.create('Ninja.grid.InvestorsGrid');
    this.items = [investorsGrid];
    this.callParent(arguments);

    investorsGrid.on('afterrender',function(cmp){
      cmp.getStore().load();
    });
    investorsGrid.on('itemclick',function(cmp, record){
      var win = Ext.getCmp('investorWindow');
      if(!win){
        win = Ext.create('Ninja.window.InvestorRelatedWindow');
      }
      win.setTitle('投资者：'+record.get("login"));
      win.show(); 
      var investorDetailTabPanel = Ext.getCmp('investorDetailTabPanel'),
          orderGrid = investorDetailTabPanel.orderGrid,
          positionGrid = investorDetailTabPanel.positionGrid;
          instrumentGrid = investorDetailTabPanel.instrumentGrid;
      var orderProxy = orderGrid.getStore().getProxy();
      orderProxy.url = '/investors/'+record.get("id")+'/orders.json';
      //orderGrid.getStore().load();
      //var positionProxy = positionGrid.getStore().getProxy();
      var instrumentProxy = instrumentGrid.getStore().getProxy();
      instrumentProxy.url = '/investors/'+record.get("id")+'/instrument_ctrls.json';
      //instrumentGrid.getStore().load();
    });
    investorsGrid.on('destroy',function(cmp){
      var win = Ext.getCmp('investorWindow');
      if(win){
        win.close();
      }
    });
  }
});