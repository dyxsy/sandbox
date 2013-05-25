Ext.define('Ninja.window.NewFinanceWithWindow',{
  extend:'Ext.window.Window',
  title:'增加配资',
  closeAction:'destroy',
  resizable:false,
  draggable:true,
  modal:true,
  width:515,
  height:250,
  border:0,
  layout:'fit',
  initComponent:function(){
    this.items = [this.createForms()];
    this.buttons = this.createButtons();
    this.callParent(arguments);
  },

  createForms:function(){
    var me = this;
    me.formPanel = Ext.create('Ext.form.Panel',{
      frame:true,
      border:0,
      items:[
        {
          xtype:'container',
          layout:'hbox',
          margin:'25 5 10 25',
          items:[
            {
              xtype:'textfield',
              labelAlign:"right",
              blankText: '配资人不能为空',
              allowBlank: false,
              name:'finance_with[customer]',
              fieldLabel:'配资人',
              width:185,
              labelWidth:50
            },
            {
              xtype:'textfield',
              name:'finance_with[login]',
              itemId:'finance_login',
              fieldLabel:'帐号',
              labelAlign:"right",
              blankText: '请选择一个帐号',
              allowBlank: false,
              labelWidth:72,
              width:220,
              margin:'0 0 0 25',
              listeners:{
                focus:function(){
                  Ext.create('Ninja.window.SingleInvestorSelector').show();
                }
              }
            },
          ]  
        },
        {
          xtype:'container',
          layout:'hbox',
          margin:'10 5 10 25',
          items:[
            {
              xtype:'numberfield',
              name:'finance_with[quota]',
              fieldLabel:'配额',
              labelAlign:"right",
              blankText: '配额不能为空',
              allowBlank: false,
              allowDecimals:false,
              hideTrigger:true,
              width:185,
              minValue:0,
              labelWidth:50,
            },
            {
              xtype:'numberfield',
              name:'finance_with[margin]',
              fieldLabel:'风险保证金',
              labelAlign:"right",
              blankText: '风险保证金不能为空',
              allowBlank: false,
              width:220,
              hideTrigger:true,
              nanText:'不能以\“.\”开头',
              minValue:0,
              labelWidth:72,
              margin:'0 0 0 25'
            }
          ]
        },
        {
          xtype:'container',
          layout:'hbox',
          margin:'10 5 10 25',
          items:[
             {
              xtype:'numberfield',
              hideTrigger:true,
              minValue:0,
              labelAlign:"right",
              itemId:'mode_fess',
              fieldLabel:'管理费',
              nanText:'不能以\“.\”开头',
              labelWidth:50,
              width:115,
              },
              {
                xtype:'label',
                text:'/',
                width:10,
                margin:'3 0 0 5'
              },
              {
                xtype:'numberfield',
                hideTrigger:true,
                labelAlign:"right",
                itemId:'mode_quota',
                allowDecimals:false,
                minValue:0,
                width:55,
              },
              {
                xtype:'label',
                text:'配额',
                labelAlign:"left",
                width:30,
                margin:'3 0 0 7'
              },
              {
                xtype:'hiddenfield',
                itemId:'mode',
                name:'finance_with[mode]',
                value:''
              },
              {
      
                xtype:'combo',
                name:'finance_with[status]',
                fieldLabel:'状态',
                labelAlign:"right",
                margin:'0 0 0 25',
                labelWidth:35,
                width:185,
                value:0,
                forceSelection:true,
                editable:false,
                displayField:'name',
                valueField:'value',
                store:Ext.create('Ext.data.Store', {
                  fields:['name','value'],
                  data: [
                    {name:'未出账',value:0},
                    {name:'已出账',value:1}
                  ]
                })
              }]
          },
          {
          xtype:'container',
          layout:'hbox',
          margin:'10 5 10 25',
          items:[{
              xtype:'textarea',
              name:'finance_with[comment]',
              fieldLabel:'备注',
              labelAlign:"right",
              labelWidth:50,
              width:430,
              height:50,
              anchor:'90%',
            }]
          }
      ]
    });
    return me.formPanel;
  },

  createButtons:function(){
    var me = this;
    var buttons = [
      {
        text:'确定',
        handler:function(){
          var mode_fess = Ext.ComponentQuery.query("#mode_fess")[0].getValue();
          var mode_quota = Ext.ComponentQuery.query("#mode_quota")[0].getValue();
          var mode = Ext.ComponentQuery.query("#mode")[0];
          mode.setValue(mode_fess+"/"+mode_quota);
          form = me.formPanel.getForm();
          if(form.isValid()){
            form.submit({
              url:"/finance_withs.json",
              method:'POST',
              success:function(){
                  me.close();
                  var financeWith = Ext.ComponentQuery.query("#financeWith")[0];
                  var financeWithStore = financeWith.getStore(); 
                  financeWithStore.load();
                  Ext.create('Ninja.window.NotificationWindow',{
                    html:"添加成功"
                  }).show();
              },
              failure:function(){
                Ext.create('Ninja.window.NotificationWindow',{
                    html:"添加失败",
                    iconCls:'ux-notification-icon-error'
                  }).show();
              },
              scope:me
            });
          }
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
  }

});