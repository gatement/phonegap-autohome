Ext.define('Autohome.view.home.Linux', {
	extend: 'Ext.Container',
	xtype: 'card_home_linux',

	config: {
		title: 'Linux',
		scrollable: 'vertical',
		layout: {
			type: 'vbox',
			align: 'middle'
		},
		defaults: { 
			styleHtmlContent: true
	   	},
		items: [
			{ 
				xtype: 'titlebar',
				docked: 'top',
				ui: 'light'
			},
			{
				itemId: "offline",
				xtype: "container",
				hidden: true,
				padding: 10,
				html: "<h2>offline</h2>"
			},
			{ 
				itemId: "online",
				xtype: "container",
				hidden: true,
				padding: 10,
				width: '100%',
				defaults: { 
					xtype: 'button',
					margin: 10,
					height: 60,
					width: '90%',
					ui: 'normal'
				},
				items: [
					{
						itemId: 'poweroff',
						text: 'poweroff'
					},
					{ 
						itemId: 'reboot',
						text: 'reboot'
					}
				]
			}
		]
	}
});
