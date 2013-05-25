Ext.define('Ninja.panel.CascadedInvestorPanel',{
  extend: 'Ext.panel.Panel',
  border: false,
  layout: 'border',
  adjustHeight: 100,
  collapsible: true,
  animCollapse: true,
  isCollapsed: false,
  groupGrid: undefined,
  cascadedInvestorGrid: undefined,
  investorDetailPanel: undefined,
  groupsDsUrl: undefined,
  cascadedInvestorDsUrl: undefined,

  initComponent: function() {
    var me = this;
    var columns = {
      items:[
        {
          text: '用户组',  
          dataIndex:'name', 
          sortable: false,
          align: "center",
          flex:1
        }
      ]
    };
    me.groupGrid = Ext.create('Ninja.grid.InterestedGroupsGrid',{
      datastoreUrl:me.groupsDsUrl,
      selType:'checkboxmodel',
      multiSelect:true,
      columns:columns,
      listeners:{
        selectionchange :function(cmp, model){
          var store = me.cascadedInvestorGrid.getStore(),
            cascadedInvestorGrid = Ext.ComponentQuery.query("#cascadedInvestorGrid"),
            top = Ext.ComponentQuery.query("#top")[0]
            middle = Ext.ComponentQuery.query("#middle")[0],
            bottom = Ext.ComponentQuery.query("#bottom")[0],
            topGrid = top.cascadedInvestorGrid,
            middleGrid = middle.cascadedInvestorGrid,
            bottomGrid = bottom.cascadedInvestorGrid,
            group_ids = [],
            group_out_ids = [];
          for(var j=0;j<model.length;j++){
            group_ids.push(model[j].get('id'));
            group_out_ids.push(model[j].get('out_id').toString());
          }
          var interested_group_ids = Ext.encode(group_ids);
          if(me.id == "topGrid"){
            var proxy = store.getProxy();
            if(group_ids.length == 0){
              topGrid.getStore().removeAll(false);
              middleGrid.getStore().removeAll(false);
              bottomGrid.getStore().removeAll(false);
              middle.groupGrid.getSelectionModel().deselectAll(true);
              bottom.groupGrid.getSelectionModel().deselectAll(false);
              return;
            }
            var ids = group_ids.join(",");
            proxy.url = '/interested_groups/'+ ids + '/investors.json';
            me.cascadedInvestorGrid.group_out_ids = group_out_ids;
            store.load(function(records){
              if(records.length == 0){
                middleGrid.getStore().removeAll(false);
                bottomGrid.getStore().removeAll(false);
              }else{
                me.topStoreSize = records.length;
              }
            });

          }else if(me.id == "middleGrid"){
            var record = topGrid.getSelectionModel().getSelection()[0];
            if(Ext.isEmpty(record)){
              return;
            }
            var middleStore = me.loadDatas(topGrid, middleGrid, interested_group_ids, record);
            middleStore.load(function(records){
              var bottomInvestorGrid = Ext.ComponentQuery.query("#bottom")[0].cascadedInvestorGrid;
              if(records.length == 0){
                bottomInvestorGrid.getStore().removeAll(false);
              }
            });
          }else{
            var record = middleGrid.getSelectionModel().getSelection()[0];
            if(Ext.isEmpty(record)){
              return;
            }
            var bottomStore = me.loadDatas(middleGrid, bottomGrid, interested_group_ids, record);
            bottomStore.load();
          }
        },

        afterrender:function(cmp){
          
          var store = cmp.getStore();
          store.on('load', function(store, records){
            var record = records[0];
            if(!record) return;
            if(me.id == "topGrid"){
              cmp.getSelectionModel().select(record, false);
            }else{
              cmp.getSelectionModel().select(records, false, true);
            }
          });

        }
      }
    });

    me.cascadedInvestorGrid = Ext.create('Ninja.grid.CascadedInvestorGrid',{
      datastoreUrl: me.cascadedInvestorDsUrl,
      position: me.position,
      listeners:{
        itemclick:function(view, record, index){
          //console.log(index);
          //该投资者所有账户的成交记录 
          //me.investorDetailPanel.tradesGrid.loadData(record.get("id"));
          //me.investorDetailPanel.investorId = record.get("id");
          //var activeTab = me.investorDetailPanel.getActiveTab();
          //activeTab.loadData(record.get("id"));
          //该投资者所有账户的子账户的投资者
          var nextPanel = Ext.getCmp(me.nextPanelId);
          if(nextPanel){
            var subAccountProxy = nextPanel.cascadedInvestorGrid.getStore().getProxy();
            nextPanel.groupGrid.getSelectionModel().selectAll();
            var sm = nextPanel.groupGrid.getSelectionModel().getSelection();
            var interested_group_ids = [];
            var group_out_ids = [];
            for(var i=0;i<sm.length; i++){
              interested_group_ids.push(sm[i].get('id'));
              group_out_ids.push(sm[i].get('out_id').toString());
            }
            nextPanel.cascadedInvestorGrid.group_out_ids = group_out_ids;
            nextPanel.cascadedInvestorGrid.investorId = record.get("id").toString();
            subAccountProxy.extraParams['interested_group_ids'] = Ext.encode(interested_group_ids);
            subAccountProxy.url = '/investors/'+record.get("id") + '/group_slave.json';
            var groupsGrid = Ext.ComponentQuery.query("#groupsGrid");
            nextPanel.cascadedInvestorGrid.getStore().load(function(records){
              if(me.id == "topGrid" && me.topStoreSize > 0){
                if(records.length == 0){
                  var bottomInvestorGrid = Ext.ComponentQuery.query("#bottom")[0].cascadedInvestorGrid;
                  bottomInvestorGrid.getStore().removeAll(false);
                  bottomInvestorGrid.attachWebSocketEvent(bottomInvestorGrid.getStore(), "equity", group_out_ids, "0");
                }
              }
            });
          }
        },

        select: function(cmp, record){
          var activeTab = me.investorDetailPanel.getActiveTab();
          activeTab.loadData(record.get("id"));
        },
        
        afterrender:function(cmp){
          var embedGrids = Ext.ComponentQuery.query('grid[open="true"]');
          for(var i=0; i<embedGrids.length; i++){
            var embedGrid = embedGrids[i];
            if(embedGrid){
              embedGrid.open = false;
            }
          }
          var store = cmp.getStore();
          store.on('load', function(store, records){
            if(!Ext.isEmpty(records ,false)){
              var record = records[0];
              if(!record) return;
              cmp.getSelectionModel().select(record,true);
            }
          });
        }
      }
    });

    me.investorDetailPanel = Ext.create('Ninja.panel.InvestorDetailsPanel');

    me.items = [me.groupGrid, me.cascadedInvestorGrid, me.investorDetailPanel];

    me.on('beforecollapse',function(cmp){
      me.resetHeight(cmp);
      cmp.isCollapsed = true;
    });

    me.on('expand',function(cmp){
      me.resetHeight(cmp);
      cmp.isCollapsed = false;
    });
    
    me.callParent(arguments);
  },

  loadDatas: function(superiorGrid, lowerGrid, interested_group_ids, record){
    var lowerStore = lowerGrid.getStore();
    var lowerProxy = lowerStore.getProxy();
    lowerProxy.extraParams['interested_group_ids'] = interested_group_ids;
    lowerProxy.url = '/investors/'+record.get("id") + '/group_slave.json';
    return lowerStore;
  },

  resetHeight: function(cmp){
    this.setHeight(this.adjustHeight);
  }

});