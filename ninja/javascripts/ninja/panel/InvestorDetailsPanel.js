Ext.define('Ninja.panel.InvestorDetailsPanel', {
  extend: 'Ext.tab.Panel',
  flex:1.5,
  region: 'east',
  split: true,
  strategyLogsGrid: undefined,
  ordersGrid: undefined,
  positionsGrid: undefined,
  tradesGrid: undefined,
  investorId: undefined,
  // bbar:[{ xtype: 'text', text: '比赛总人数：600',height:20}],
  initComponent:function(){
    var me = this;
    me.strategyLogsGrid = Ext.create('Ninja.grid.StrategyLogsGrid');
    me.tradesGrid       = Ext.create('Ninja.grid.TradesGrid');
    me.ordersGrid       = Ext.create('Ninja.grid.OrdersGrid');
    me.positionsGrid    = Ext.create('Ninja.grid.PositionsGrid');
    me.items = [me.positionsGrid, me.tradesGrid, me.strategyLogsGrid, me.ordersGrid];

    me.callParent(arguments);
  },
  listeners: {
    tabchange: function(tabPanel, newTab){
      if(this.investorId){
        newTab.loadData(this.investorId);
      }
    }
  }
});