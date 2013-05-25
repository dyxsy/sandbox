Ext.define('Ninja.window.SingleInvestorSelector',{
  extend:'Ext.window.Window',
  title:'选择投资者帐号',
  closeAction:'hide',
  resizable:false,
  draggable:true,
  modal:true,
  width:280,
  height:370,
  border:0,
  layout:'border',

  initComponent:function(){
    var me = this;
    me.gridPanel = Ext.create('Ninja.grid.InvestorsSelector',{
      region:'center',
      multiSelect:false,
      width:275,
      listeners:{
        afterrender:function(cmp){
          var store = cmp.getStore();
          store.getProxy();
          store.load();
        }
      }
    });
    me.items = [me.buttons,me.gridPanel];
    me.buttons = me.createButtons();
    me.callParent(arguments);
  },

  createButtons:function(){
    var me = this;
    var buttons = [
      {
        text:'确定',
        handler:function(){
          var record = me.gridPanel.getSelectionModel().getSelection()[0];
          me.getInvestorLogin(record);
        }
      },
      {
        text:'取消',
        handler:function(){
          me.close();
        }
      }
    ];
    return buttons;
  },

  getInvestorLogin:function(record){
    var me = this;
    if(Ext.isEmpty(record)){
      Ext.Msg.alert("提示","请选择一个投资者");
      return;
    }
    var login = Ext.ComponentQuery.query("#finance_login")[0];
    login.setValue(record.get('login'));
    me.close();
  }
});