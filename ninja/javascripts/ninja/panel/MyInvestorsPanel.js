Ext.define('Ninja.panel.MyInvestorsPanel',{
  extend: 'Ext.container.Container',
  itemId:'ninja.panel.my_investors_pannel',
  pageHeight: undefined,
  celling: 6,
  topGrid: undefined,
  middleGrid : undefined,
  bottomGrid: undefined,

  initComponent: function() {

    var me  = this,
        // heightTop = Ext.getCmp("headerContainer").getHeight(),
        heightMenu = Ext.getCmp("main_toolbar").getHeight(),
       // height = document.documentElement.clientHeight - heightTop - heightMenu -me.celling;
        height = window.innerHeight  - heightMenu -me.celling;
        me.pageHeight = height;

      
      me.topGrid = Ext.create('Ninja.panel.CascadedInvestorPanel', {
        id: 'topGrid',
        itemId:'top',
        title: '一级用户', 
        height: me.pageHeight/3,
        nextPanelId: 'middleGrid',
        groupsDsUrl: '/interested_groups.json',
        position: "top"
      });
     
    
      me.middleGrid = Ext.create('Ninja.panel.CascadedInvestorPanel', {
        id:'middleGrid',
        itemId:'middle',
        title: '二级用户', 
        margin:'3 0 3 0',
        height: me.pageHeight/3,
        nextPanelId:'bottomGrid',
        groupsDsUrl: '/interested_groups.json',
        position: "middle"
      });
    
      me.bottomGrid = Ext.create('Ninja.panel.CascadedInvestorPanel', {
        id:'bottomGrid',
        itemId:'bottom',
        title: '三级用户', 
        height: me.pageHeight/3,
        groupsDsUrl: '/interested_groups.json',
        position: "bottom"
      });

  
    Ext.override(me.topGrid, {
      resetHeight: function (cmp) {
        me.computeHeight(cmp);
      }
    });  
    Ext.override(me.middleGrid, {
      resetHeight: function (cmp) {
        me.computeHeight(cmp);
      }
    });
    Ext.override(me.bottomGrid, {
      resetHeight: function (cmp) {
        me.computeHeight(cmp);
      }
    });    
    me.items = [me.topGrid,me.middleGrid,me.bottomGrid];
    
    me.callParent(arguments);
  },

  computeHeight : function(cmp) {
    
    var me = this,
    topGrid = me.topGrid,
    middleGrid = me.middleGrid,
    bottomGrid = me.bottomGrid,
    tgHeight,mgHeight,bgHeight,
    minHeight = me.createMinHeightValue();
   // me.topGrid is clicked
    if(cmp.id == topGrid.id ) { 
       
      if(topGrid.isCollapsed == false){  //collapsed
         
        if(middleGrid.isCollapsed == false){ 
              
          if(bottomGrid.isCollapsed == false){
           
             mgHeight = me.pageHeight * 2/3 - minHeight;
             bgHeight = me.pageHeight/3;
          }else{
               // tgHeight = minHeight;
               mgHeight = me.pageHeight - minHeight * 2;
               bgHeight = minHeight;
           }  
        }else{
           if(bottomGrid.isCollapsed == false){
             // tgHeight = minHeight;
             mgHeight = minHeight;
             bgHeight = me.pageHeight -minHeight * 2;
           }else{
              // tgHeight = minHeight;
              mgHeight = minHeight;
              bgHeight = minHeight;
           }
         }
      }else{
         if(middleGrid.isCollapsed == false){
           if(bottomGrid.isCollapsed == false){
             tgHeight = me.pageHeight/3;
             mgHeight = me.pageHeight/3;
             bgHeight = me.pageHeight/3;
           }else{
              tgHeight = me.pageHeight/3;
              mgHeight = me.pageHeight * 2/3 - minHeight;
              bgHeight = minHeight;
           }
         }else{
            if(bottomGrid.isCollapsed == false){
              tgHeight = me.pageHeight/3;
              mgHeight = minHeight;
              bgHeight = me.pageHeight * 2/3 - minHeight ;
            }else{
               tgHeight = me.pageHeight - minHeight * 2;
               mgHeight = minHeight;
               bgHeight = minHeight;
             }
          }
       }   
    }
    // me.middleGrid is clicked
    if(cmp.id == middleGrid.id ){
      if(middleGrid.isCollapsed == false){
        if(topGrid.isCollapsed == false){
          if(bottomGrid.isCollapsed == false){
             tgHeight = me.pageHeight/3;
             // mgHeight = minHeight;
             bgHeight = me.pageHeight * 2/3 - minHeight;

          }else{
             tgHeight = me.pageHeight - minHeight * 2;
             // mgHeight = minHeight;
             bgHeight = minHeight;
          }
        }else{
           if(bottomGrid.isCollapsed == false){
             tgHeight = minHeight;
             // mgHeight = minHeight;
             bgHeight = me.pageHeight - minHeight * 2;
           }else{
              tgHeight = minHeight;
              // mgHeight = minHeight;
              bgHeight = minHeight;
           }
         }
      }else{
         if(topGrid.isCollapsed == false){ 
           if(bottomGrid.isCollapsed == false){
             tgHeight = me.pageHeight/3;
             mgHeight = me.pageHeight/3;
             bgHeight = me.pageHeight/3;
           }else{
              tgHeight = me.pageHeight/3;
              mgHeight = me.pageHeight * 2/3 - minHeight;
              bgHeight = minHeight;
            }
         }else{
            if(bottomGrid.isCollapsed == false){
              tgHeight = minHeight;
              mgHeight = me.pageHeight * 2/3 - minHeight;
              bgHeight = me.pageHeight/3;
            }else{
              tgHeight = minHeight;
              mgHeight = me.pageHeight - minHeight * 2;
              bgHeight = minHeight;
             }
          }
       }
    }
    //me.bottomGrid is clicked
    if(cmp.id == bottomGrid.id ){
      if(bottomGrid.isCollapsed == false){
        if(topGrid.isCollapsed == false){
          if(middleGrid.isCollapsed == false){
            tgHeight = me.pageHeight/3;
            mgHeight = me.pageHeight * 2/3 - minHeight;
            // bgHeight = minHeight;
          }else{
             tgHeight = me.pageHeight - minHeight * 2;
             mgHeight = minHeight;
             // bgHeight = minHeight;
          }
        }else{
           if(middleGrid.isCollapsed == false){
             tgHeight = minHeight;
             mgHeight = me.pageHeight - minHeight * 2;
             // bgHeight = minHeight;
           }else{
              tgHeight = minHeight;
              mgHeight = minHeight;
              // bgHeight = minHeight;
           }
         }
      }else{
         if(topGrid.isCollapsed == false){
           if(middleGrid.isCollapsed == false){
             tgHeight = me.pageHeight/3;
             mgHeight = me.pageHeight/3;
             bgHeight = me.pageHeight/3;
           }else{
              tgHeight = me.pageHeight/3;
              mgHeight = minHeight;
              bgHeight = me.pageHeight * 2/3 - minHeight;
            }
         }else{
            if(middleGrid.isCollapsed == false){
             tgHeight = minHeight;
             mgHeight = me.pageHeight * 2/3 - minHeight;
             bgHeight = me.pageHeight/3;
            }else{
               tgHeight = minHeight;
               mgHeight = minHeight;
               bgHeight = me.pageHeight - minHeight * 2;
             }
          }
      }
    }


    topGrid.setHeight(tgHeight);
    middleGrid.setHeight(mgHeight);
    bottomGrid.setHeight(bgHeight);
  },

  createMinHeightValue:function(){
    this.minValue = this.pageHeight * (24/533);
    return this.minValue;
  },
});
 
