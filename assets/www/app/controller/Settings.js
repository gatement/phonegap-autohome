Ext.define('Autohome.controller.Settings', {
	extend: 'Ext.app.Controller',

	config: {
		refs: {
			jsonpRadio: 'card_settings #jsonp',
			saveBtn: 'card_settings #save',
		},
		control: {
			saveBtn: {
				tap: 'save'
			}
		},
	},

	save: function()
	{
		if(typeof(Storage) == 'undefined')
		{
			Ext.Msg.alert('Your browser is not supported saving the settings. Firefox or Chrome is recommended.');
		}
		else
		{
			if(this.getJsonpRadio().isChecked())
			{
				window.localStorage.conn_type = 'jsonp';
			}
			else
			{
				window.localStorage.conn_type = 'websocket';
			}
		}
	}
});

