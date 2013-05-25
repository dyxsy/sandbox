Ext.define("Ninja.window.AdvancedSearchWindow",{
  extend: "Ext.window.Window",
  mixins: {
      sessionStateful: 'Ninja.util.SessionStateful',
      stashHelper: 'Ninja.util.StashHelper'
  },
  constrainHeader: true,
  resizable: true,
  closeAction: 'hide',
  height: 330,
  width: 470,
  minHeight: 330,
  minWidth: 470,
  title: "高级搜索",
  border: 0,
  modal : true,
  layout: 'fit',
  initComponent:function() {
    var me = this;
    var form = me.createForm();
    me.on('show', function(cmp){
      cmp.setSize(cmp.minWidth, cmp.minHeight);
      cmp.center();
    });
    me.on('beforehide', function(cmp){
      cmp.advancedSearch.getForm().reset();
    });
    me.items = [form];
    me.callParent(arguments);
  }, 
  createForm: function(){
    var me = this;
    me.advancedSearch = Ext.create("Ext.form.Panel",{
      region: 'center',
      frame: true,
      autoScroll: true,
      buttonAlign: 'center',
      defaults: {
        margin: '5 0 0 0',
        anchor: '95%'
      },
      items: [
        {
          xtype: 'fieldcontainer',
          layout: 'hbox',
          defaultType: 'textfield',
          fieldDefaults: {labelAlign: 'right',labelWidth:120,labelSeparator: '',flex: 1},
          items: [
            { fieldLabel: '账号：',
              name: 'login',
              itemId: "login",
            }
          ]
        },
        {
          xtype: 'fieldcontainer',
          layout: 'hbox',
          defaultType: 'textfield',
          fieldDefaults: {labelAlign: 'right',labelWidth:120,labelSeparator: '',flex: 1},
          items: [
            { fieldLabel: '身份证：',
              name: 'id_no',
              itemId: "id_no",
            }
          ]
        },
        {
          xtype: 'fieldcontainer',
          layout: 'hbox',
          defaultType: 'textfield',
          fieldDefaults: {labelAlign: 'right',labelWidth:120,labelSeparator: '',flex: 1},
          items: [
            { fieldLabel: '手机号：',
              name: 'phone',
              itemId: "phone",
            }
          ]
        },
        {
          xtype: 'fieldcontainer',
          layout: 'hbox',
          defaultType: 'datefield',
          fieldDefaults: {labelAlign: 'right',labelWidth:120,labelSeparator: '',flex: 1},
          items: [
            { fieldLabel: '最后登录时间：',
              name: 'login_at',
              itemId: "login_at",
            }
          ]
        },
        {
          xtype: 'radiogroup',
          labelSeparator: '',
          labelWidth:120,
          labelAlign: 'right',
          fieldLabel: '状态：',
          itemId: "status",
          columns: 4,
          vertical: true,
          items: [
            { boxLabel: '未激活',   name: 'status',inputValue: '0'},
            { boxLabel: '激活',   name: 'status', inputValue: '1'},
            { boxLabel: '冻结', name: 'tatus', inputValue:'2' }
          ]
        },
        {
          xtype: 'fieldcontainer',
          layout: 'hbox',
          defaultType: 'textfield',
          fieldDefaults: {labelAlign: 'right',labelSeparator: ''},
          items: [
            { fieldLabel: '保证金范围：',
              name: 'margin_down',
              xtype: 'numberfield',
      		    hideTrigger: true,
      		    labelWidth:120,
      		    flex: 6,
      		    itemId: "margin_down",
      		    nanText: '保证金上限必须是数字'
            }, 
            { xtype: 'splitter',width: 5},
            { fieldLabel: '-&emsp;',
              name: 'margin_up',
              xtype: 'numberfield',
      		    hideTrigger: true,
      		    labelWidth:30,
      		    flex: 4,
      		    itemId: "margin_up",
      		    nanText: '保证金下限必须是数字',
              validator: function(value) {
                var fd = this.up('form').down('textfield[itemId=margin_down]');
                if(Ext.isEmpty(value)){
                  return  true;
                }else{
                  return (value >= fd.getValue()) ? true : '保证金上限不能小于保证金下限....';
                }
                
              }
            }
          ]
        },
        {
          xtype: 'fieldcontainer',
          layout: 'hbox',
          defaultType: 'textfield',
          fieldDefaults: {labelAlign: 'right',labelSeparator: ''},
          items: [
            { fieldLabel: '总资金范围：',
              name: 'total_capital_down',
              xtype: 'numberfield',
              hideTrigger: true,
              labelWidth:120,
              flex: 6,
              itemId: "total_capital_down",
              nanText: '总资金上限必须是数字'
            }, 
            { xtype: 'splitter',width: 5},
            { fieldLabel: '-&emsp;',
              name: 'total_capital_up',
              xtype: 'numberfield',
              hideTrigger: true,
              labelWidth:30,
              flex: 4,
              itemId: "total_capital_up",
              nanText: '总资金下限必须是数字',
              validator: function(value) {
                var fd = this.up('form').down('textfield[itemId=total_capital_down]');
                if(Ext.isEmpty(value)){
                  return  true;
                }else{
                  return (value >= fd.getValue()) ? true : '总资金上限不能小于总资金下限....';
                }
                
              }
            }
          ]
        },
        {
          xtype: 'fieldcontainer',
          layout: 'hbox',
          defaultType: 'textfield',
          fieldDefaults: {labelAlign: 'right',labelSeparator: ''},
          items: [
            { fieldLabel: '可用资金范围：',
              name: 'available_capital_down',
              xtype: 'numberfield',
      		    hideTrigger: true,
      		    labelWidth:120,
      		    flex: 6,
      		    itemId: "available_capital_down",
      		    nanText: '可用资金上限必须是数字'
            }, 
            { xtype: 'splitter',width: 5},
            { 
              fieldLabel: '-&emsp;',
              name: 'available_capital_up',
              xtype: 'numberfield',
      		    hideTrigger: true,
      		    labelWidth:30,
      		    flex: 4,
      		    itemId: "available_capital_up",
      		    nanText: '可用资金下限必须是数字',
              validator: function(value) {
                var fd = this.up('form').down('textfield[itemId=available_capital_down]');
                if(Ext.isEmpty(value)){
                  return  true;
                }else{
                  return (value >= fd.getValue()) ? true : '可用资金上限不能小于可用资金下限';
                }
                
              }   
            }
          ]
        }
      ],
      buttons: [{
        text:'搜索',
        formBind: true,
        disabled: true,
        handler: function(){
          var win = this,
            grid = this.grid,
            ds = grid.getStore(),
            proxy = ds.getProxy(),
            extraParams = proxy.extraParams,
            form = this.advancedSearch.getForm(),
            fieldsValues = form.getFieldValues();
            proxy.url = '/investors/search.json';
            proxy.extraParams = {
            "advanced_query[login]"                      : fieldsValues.login,
            "advanced_query[id_no]"                      : fieldsValues.id_no,
            "advanced_query[phone]"                      : fieldsValues.phone,
            "advanced_query[status]"                     : fieldsValues.status,
            "advanced_query[margin_up]"                  : fieldsValues.margin_up,
            "advanced_query[margin_down]"                : fieldsValues.margin_down,
            "advanced_query[total_capital_up]"           : fieldsValues.total_capital_up,
            "advanced_query[total_capital_dwon]"         : fieldsValues.total_capital_dwon,
            "advanced_query[available_capital_up]"       : fieldsValues.available_capital_up,
            "advanced_query[available_capital_down]"     : fieldsValues.available_capital_down
          }
          ds.load();
         /* var contest_status = fieldsValues.contest_status;
          if(contest_status == 0){
            contest_status = "淘汰"
          }else if(contest_status ==1 ){
            contest_status = "比赛中" 
          }else if(contest_status == 2){
            contest_status = "晋级"
          }else if(contest_status == null ){
            contest_status = null;
          }else{
            contest_status = null;
          }
          var login = fieldsValues.login;
          if(Ext.isEmpty(login,false)){
            login = null;
          }
          var data = {
            login                      : login,
            contest_status             : contest_status,
            margin_up                  : fieldsValues.margin_up,
            margin_down                : fieldsValues.margin_down,
            equity_up                  : fieldsValues.equity_up,
            equity_down                : fieldsValues.equity_down,
            cumulative_net_profit_up   : fieldsValues.cumulative_net_profit_up,
            cumulative_net_profit_down : fieldsValues.cumulative_net_profit_dwon,
            promation_delta_up         : fieldsValues.promation_delta_up,
            promation_delta_down       : fieldsValues.promation_delta_down,
            converted_profit_up        : fieldsValues.converted_profit_up,
            converted_profit_down      : fieldsValues.converted_profit_down
          }*/

          win.close();
        },scope: this
      }, {
        text:'取消',
        handler:function(){
          this.close();
        },scope: this
      }]
    });
    return me.advancedSearch;
  },
  
});


