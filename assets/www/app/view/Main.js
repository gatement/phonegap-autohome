Ext.define('Autohome.view.Main', {
	extend: 'Ext.tab.Panel',
	xtype: 'card_main',
	requires: [
		'Autohome.view.Arduino',
		'Autohome.view.Windows',
		'Autohome.view.Linux',
		'Autohome.view.Settings'
	],

	config: {
		defaults: { 
			styleHtmlContent: true
	   	},
		tabBar: {
			docked: 'bottom',
		},
		items: [
			{
				xtype: 'toolbar',
				docked: 'top',
				ui: 'light',
				defaults: { xtype: 'button'},
				items:
				[
					{ 
						text: 'LOGOUT',
						itemId: 'logout',
						iconCls:'arrow_left',
						ui: 'action',
						docked: 'left'
				   	},
					{ 
						text: 'REFRESH',
						itemId: 'refresh',
						iconCls:'refresh',
						ui: 'action',
						docked: 'right'
					}
				]
			},
			{ xtype: 'card_arduino' },
			{ xtype: 'card_windows' },
			{ xtype: 'card_linux' },
			{ xtype: 'card_settings' }
		]	
	}
})
