Ext.define("Ninja.BrowserWarning",{
  extend: "Ext.window.Window",  
  height: 130,
  width: 450,
  title: '警告',
  border: 0,
  modal : true,
  closable:false,
  resizable:false,
  layout: 'border',
  icon: 'warning-icon',
  initComponent:function() {
    this.items = [this.createIconPanel(),this.createPanel()];
    this.callParent(arguments);
  },
  createPanel: function(){

      var panel = Ext.create("Ext.panel.Panel",{
      region: 'west',
      padding: '30 20 0 20',
      baseCls : 'field-bgcolor',
      items:[Ext.create('Ext.Img', {
          width:30,
          height:30,
          src: 'assets/icon-warning.gif'
        })
      ]
    });
    return panel;
  },
  createIconPanel: function(){
    var ua = navigator.userAgent.toLowerCase();
    var isWin7 = ua.indexOf("nt 6.1") > -1;
    var isVista = ua.indexOf("nt 6.0") > -1;
    var isWinXp = ua.indexOf("nt 5.1") > -1;
    var ie;

    if(isWinXp){
       ie = '&nbsp;&bull;&nbsp;<a  target ="_blank" href="http://www.microsoft.com/downloads/zh-cn/details.aspx?FamilyID=341c2ad5-8c3d-4347-8c03-08cdecd8852b">升级IE8浏览器</a><br />';
    }else{
       ie = '&nbsp;&bull;&nbsp;<a  target ="_blank" href="http://windows.microsoft.com/zh-CN/internet-explorer/downloads/ie-9/worldwide-languages">升级IE9浏览器</a><br />';
    }
    var html = '<p>您当前使用的浏览器为'+ Ext.browser.name +" "+ Ext.browser.version.version+'。在浏览比赛成绩以及图表方面存在不兼容，为了达到更好的体验，我们建议您做以下任一项操作：<br />'+  ie +
        '&nbsp;&bull;&nbsp;<a  target ="_blank" href="http://www.google.cn/chrome/intl/zh-CN/landing_chrome.html">下载Google Chrome浏览器</a><br />'+
        '&nbsp;&bull;&nbsp;<a  target ="_blank" href="http://www.mozilla.org/en-US/products/download.html?product=firefox-11.0&os=osx&lang=zh-CN">下载火狐浏览器</a>'+
        '</p>';
    var panel = Ext.create("Ext.panel.Panel",{
      padding: '10 0 0 0',
      region: 'center',
      layout:"fit",
      baseCls : 'field-bgcolor',
      html: html
    });
    return panel;
  }
});

