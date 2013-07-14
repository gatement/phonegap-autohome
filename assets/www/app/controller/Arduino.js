Ext.define('Autohome.controller.Arduino', {
	extend: 'Ext.app.Controller',

	config: {
		refs: {
			windowspcBtn: 'card_arduino #windowspc',
			switch2Btn: 'card_arduino #switch2',
			switch3Btn: 'card_arduino #switch3'
		},
		control: {
			windowspcBtn: {
				tap: 'toggle_windowspc'
			},
			switch2Btn: {
				tap: 'toggle_switch2'
			},
			switch3Btn: {
				tap: 'toggle_switch3'
			},
		},
	},

	toggle_windowspc: function(target)
	{
		var status = 1;
		var badgeText = target.getBadgeText();
		if(badgeText)
		{
			status = 0;
		}

		var deviceType = 'arduino';
		var switchId = '1';
		main.update_switch_status(deviceType, switchId, status);
	},

	toggle_switch2: function(target)
	{
		var status = 1;
		var badgeText = target.getBadgeText();
		if(badgeText)
		{
			status = 0;
		}

		var deviceType = 'arduino';
		var switchId = '2';
		main.update_switch_status(deviceType, switchId, status);
	},

	toggle_switch3: function(target)
	{
		var status = 1;
		var badgeText = target.getBadgeText();
		if(badgeText)
		{
			status = 0;
		}

		var deviceType = 'arduino';
		var switchId = '3';
		main.update_switch_status(deviceType, switchId, status);
	}
});
