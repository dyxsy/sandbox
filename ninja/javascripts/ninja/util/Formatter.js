Ext.define('Ninja.util.Formatter', {
    requires: [],

    statics: {
    },

    // 格式化买卖方向
    formatDirection: function(value){
      if(value > 0 ){
        return '<span style="color:red"> 买 </span>';
      }else{
        return '<span style="color:green"> 卖 </span>';
      }
    },
    formatDirection2: function(value, cellmeta, record){
      var offset = record.get("offset");
      if(value == 1){
        if(offset == 1){
          return '<span style="color:red"> 买 </span>';
        }else{
          return '<span style="color:green"> 卖 </span>';
        }
      }else {
        if(offset == 1){
          return '<span style="color:green"> 卖 </span>';
        }else{
          return '<span style="color:red"> 买 </span>';
        }
      }
    },

    // 格式化价钱,保留2位有效数
    formatPrice: function(value) {
      if(!Ext.isEmpty(value, false)){
         var value2 = parseFloat(value);
         return value2.toFixed(2);
      }
    },

    // 格式化日期时间,精确到纳秒
    formatDatetime: function(value) {
      var date = new Date(value);
      return Ext.Date.format(date,'Y-m-d H:i:s') + '.' + date.getMilliseconds();
    },

    // 格式化价钱,保留2位有效数,添加颜色区分，红表示盈利，绿表示亏损
    formatColorPrice: function(value) {
      if(!Ext.isEmpty(value, false)){
         var value2 = parseFloat(value);
        if(value2 > 0 ){
          return '<span style="color:red; celling:0 10 0 0">'+ value2.toFixed(2) +'</span>';
        }
        else if(value2 == 0 ){
          return value2.toFixed(2);
        }else{
          return '<span style="color:green">' + value2.toFixed(2) + '</span>';
        }
      }
    },

    // 格式化开平仓
    formatOffset: function(value){
      if(value == 1){
        return '开';
      }else if (value == 2){
        return '<span celling:0 10 0 0"> 平 </span>';
      }
    },

    // 格式化仓位类型
    formatPosType: function(value){
      if(value ==1){
        return '昨仓';
      }else{
        return '今仓';
      }
    },

    // 格式化投机/套保
    formatVorh:function(value){
      if(value == 1){
        return '投机';
      }else if(value == 3){
        return '套保';
      }
    },
    formatPerc: function(value){
      if(value!=null){
        var value2 = parseFloat(value);
        return value2.toFixed(2) + '%';
      }
    },

    formatColorPerc: function(value){
      if(value!=null){
        var value2 = parseFloat(value);
        if (value >= 80) {
          return '<span style="color:red">' + value2.toFixed(2) + '%</span>';
        }else if(value >=30 && value <= 80){
          return '<span style="color:green">' + value2.toFixed(2) + '%</span>';
        }else{
          return value2.toFixed(2) + '%';  
        } 
      }
    }
});
