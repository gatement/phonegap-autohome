Ext.define('Autohome.controller.Linux', {
	extend: 'Ext.app.Controller',

	config: {
		refs: {
			poweroffBtn: 'card_linux #poweroff',
			rebootBtn: 'card_linux #reboot'
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
		var deviceType = 'linux';
		var cmd = 'poweroff';
		main.send_command(deviceType, cmd);
	},

	reboot: function()
	{
		var deviceType = 'linux';
		var cmd = 'restart';
		main.send_command(deviceType, cmd);
	}
});
