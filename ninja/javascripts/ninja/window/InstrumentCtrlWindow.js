Ext.define('Ninja.window.InstrumentCtrlWindow', {
  extend: 'Ext.window.Window',
  title:'合约设置',
  height: 420,
  width: 450,
  layout: 'fit',
  draggable: true,
  // headerPosition: 'left',
  
  initComponent:function(){
    
    Ext.apply(this,{
     
      items: [Ext.create('Ninja.grid.InstrumentEdit')]
    });
    
    this.callParent(arguments);
  }
});