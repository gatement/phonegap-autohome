Ext.define('Autohome.view.Loading', {
	extend: 'Ext.Container',
	xtype: 'card_loading',

	config: {
		title: 'HOME',
		iconCls: 'home',
		defaults: { 
			styleHtmlContent: true
	   	},
		layout: {
			type: 'hbox',
			pack: 'center'
		},
		items: [
			{
				xtype: 'container',
				padding: 10,
				html: '<h2>loading...</h2>'
				
			}
		]
	}
});
