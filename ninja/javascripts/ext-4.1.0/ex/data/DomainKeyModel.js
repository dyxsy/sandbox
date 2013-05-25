Ext.define('Ext.ex.data.DomainKeyModel', {
  extend: 'Ext.data.Model',
  alternateClassName: 'Ext.ex.data.KeyRecord',

  //requires: ["Ext.data.DomainKeyGenerator"],

  keyFields: ['id'],

  //idgen: Ext.data.DomainKeyGenerator(this),
  
  getKey: function(){
    var me = this,
        i = 0,
        length = me.keyFields.length,
        values = [],
        val;
    for(; i < length; i++) {
      val = me.get(me.keyFields[i])
      values.push(val)
    }   
    return values.join("_");
  }
});