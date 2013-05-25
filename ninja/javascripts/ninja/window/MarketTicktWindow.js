
Ext.define('Ninja.window.MarketTicktWindow', {
  extend: 'Ext.window.Window',
  title: '行情',
  initComponent:function(){
    Ext.apply(this,{
      height: 420,
      width: 450,
      layout: 'fit',
      draggable: true,
      items: [Ext.create('Ninja.grid.MarketTicktsGrid')]
    });
    this.on('close',function(){
      Ext.ux.WebSocketManager.closeAll();
    });
    this.callParent(arguments);
  }
});