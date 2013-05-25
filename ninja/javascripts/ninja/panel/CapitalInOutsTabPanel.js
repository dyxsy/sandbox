Ext.define('Ninja.panel.CapitalInOutsTabPanel', {
  extend: 'Ext.tab.Panel',
  border: 0,
  initComponent:function(){
    var me = this;
    var paymentGrid = Ext.create('Ninja.grid.PaymentsGrid');
    var withdrawalsGrid = Ext.create('Ninja.grid.WithdrawalsGrid');
    me.items = [ paymentGrid, withdrawalsGrid ];
    me.callParent(arguments);
  }
});