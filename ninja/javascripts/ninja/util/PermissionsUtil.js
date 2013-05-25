Ext.define('Ninja.util.PermissionsUtil', {
  gen_permission:function(powerBits){
    if (!Ext.isArray(powerBits)){
      return ;
    }
    var permissions = 0;
    for(var i = 0; i < powerBits.length; i++){
      var powerBit = Math.pow(10, powerBits[i]-1);
      var mask = parseInt(powerBit,2);
      permissions = (mask | permissions);
    }
    return permissions;
  },
  
  allow:function(permission, powerBit){
    powerBit = Math.pow(10, powerBit- 1);
    var temp = parseInt(powerBit,2);
    if((permission & temp) > 0){
      return true;
    }else{
      return false;
    }
  }
});
