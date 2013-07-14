Ext.define('Autohome.view.Arduino', {
	extend: 'Ext.Container',
	xtype: 'card_arduino',

	config: {
		title: 'ARDUINO',
		iconCls: 'home',
		scrollable: false,
		layout: {
			type: 'vbox',
			align: 'middle'
		},
		items: [
			{
				itemId: "loading",
				xtype: "container",
				hidden: true,
				padding: 10,
				html: "<h2>loading...</h2>"
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
						itemId: 'windowspc',
						text: 'window pc'
					},
					{ 
						itemId: 'switch2',
						text: 'switch2'
					},
					{ 
						itemId: 'switch3',
						text: 'switch3'
					}
				]
			}
		]
	}
});
