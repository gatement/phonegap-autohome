Ext.define('Autohome.controller.Windows', {
	extend: 'Ext.app.Controller',

	config: {
		refs: {
			poweroffBtn: 'card_windows #poweroff',
			rebootBtn: 'card_windows #reboot'
		},
		control: {
			poweroffBtn: {
				tap: 'poweroff'
			},
			rebootBtn: {
				tap: 'reboot'
			}
		},
	},

	poweroff: function()
	{
		var deviceType = 'windows';
		var cmd = 'poweroff';
		main.send_command(deviceType, cmd);
	},

	reboot: function()
	{
		var deviceType = 'windows';
		var cmd = 'restart';
		main.send_command(deviceType, cmd);
	}
});
