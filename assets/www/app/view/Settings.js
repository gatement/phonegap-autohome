Ext.define('Autohome.view.Settings', {
	extend: 'Ext.form.Panel',
	xtype: 'card_settings',

	config: {
		title: 'SETTINGS',
		iconCls: 'settings',
		scrollable: 'vertical',
		layout: {
			type: 'vbox',
			align: 'middle'
		},
		defaults: {
			labelAlign: 'left',
			width: '100%',
			labelWidth: '33%'
		},
		items: [
			{
				xtype: 'radiofield',
				itemId: 'jsonp',
				name: 'conn_type',
				label: 'JSONP',
				checked: window.localStorage.conn_type == undefined || window.localStorage.conn_type == 'jsonp'
			},
			{
				xtype: 'radiofield',
				itemId: 'websocket',
				name: 'conn_type',
				label: 'WEB SOCKET',
				checked: window.localStorage.conn_type == 'websocket'
			},
			{
				itemId: 'save',
				xtype: 'button',
				docked: 'bottom',
				text: 'SAVE',
				margin: 10,
				width: '90%',
				height: 50,
				ui: 'action',
			}
		]
	}
});
