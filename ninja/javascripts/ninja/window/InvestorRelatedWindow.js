Ext.define('Ninja.window.InvestorRelatedWindow', {
  extend: 'Ext.window.Window',
  closeAction:'hide',
  initComponent:function(){
    var width = window.innerWidth * 0.45,
        menuHeight = Ext.getCmp("main_toolbar").getHeight(),
        bbarHeight = Ext.ComponentQuery.query("#investorsBbar")[0].getHeight(),
        height = window.innerHeight - menuHeight - bbarHeight;
    Ext.apply(this,{
        id:'investorWindow',
        width: width,
        height: height,
        x: window.innerWidth- width,
        y: menuHeight,
        plain: true,
        draggable:false,
        headerPosition: 'left',
        layout: 'fit',
        items: [Ext.create('Ninja.panel.InvestorsDetailTabPanel')]
    });
    
    this.callParent(arguments);
  }
});