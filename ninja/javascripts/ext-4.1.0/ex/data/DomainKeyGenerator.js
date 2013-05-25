Ext.define('Ext.data.DomainKeyGenerator', {
  extend: 'Ext.data.IdGenerator',
  alias: 'idgen.domainkey',

  constructor: function(model) {
    var me = this;
    me.model = model;

    me.callParent(arguments);

    me.parts = [];
  },

  model: undefined,

  generate: function () {
    var me = this;
    me.model.getKey();
  },

  getRecId: function (rec) {
   return rec.modelName + '-' + rec.internalId;
  }

});