Ext.define('Autohome.view.Main', {
	extend: 'Ext.tab.Panel',
	xtype: 'card_main',
	requires: [
		'Autohome.view.Loading',
		'Autohome.view.Home',
		'Autohome.view.Settings'
	],

	config: {
		tabBar: {
			docked: 'bottom',
		},
		items: [
			{ xtype: 'card_loading' },
			{ 
				xtype: 'card_home',
				hidden: true	
			},
			{ xtype: 'card_settings' }
		]	
	}
})
