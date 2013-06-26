var tbar = Ext.create('Ext.toolbar.Toolbar',{
      xtype: 'container',
      layout: 'anchor',
      border: 0,
      defaults: {anchor: '0'},
      defaultType: 'toolbar',
      items: [{
        items: [
        {
          text: 'aaaa'
        }] // toolbar 1
      }, {
        items: [{
          text: 'bbb'
        }] // toolbar 2
      }]