Ext.define('Autohome.controller.Main', {
	extend: 'Ext.app.Controller',

	config: {
		refs: {
			logoutBtn: 'card_main #logout',
			refreshBtn: 'card_main #refresh'
		},
		control: {
			logoutBtn: {
				tap: 'logout'
			},
			refreshBtn: {
				tap: 'refresh'
			}
		},
	},

	logout: function()
	{
		Ext.ComponentQuery.query('card_main')[0].destroy();
		Ext.Viewport.add({
			xclass: 'Autohome.view.Login' 
		});
	},

	refresh: function()
	{
		main.list_devices();
	}
});
