Ext.define('Ninja.panel.InvestorsDetailTabPanel', {
  extend: 'Ext.tab.Panel',
  id:'investorDetailTabPanel',
  orderGrid:undefined,
  positionGrid:undefined,
  instrumentGrid:undefined,
  initComponent:function(){
    var me = this;
    me.orderGrid = Ext.create('Ninja.grid.OrdersGrid');
    me.positionGrid = Ext.create('Ninja.grid.PositionsGrid');
    me.instrumentGrid =  Ext.create('Ninja.grid.InstrumentCtrlsGrid',{title:'可交易合约'});
    me.items = [me.orderGrid, me.positionGrid, me.instrumentGrid],
    me.callParent(arguments);
  }
});