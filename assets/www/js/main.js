var main = {
	login_success: function(sessionId)
	{
		settings.sessionVal = sessionId;

		Ext.ComponentQuery.query('card_login')[0].destroy();
		Ext.Viewport.add({
			xclass: 'Autohome.view.Main' 
		});
		
		main.socket_init();
		main.socket_connect();
	},

	//============ helpers ======================================================================
	update_arduino: function(data, animation)
	{
		titlebar = Ext.ComponentQuery.query('card_home_arduino titlebar')[0];
		offlineContainer = Ext.ComponentQuery.query('card_home_arduino #offline')[0];
		onlineContainer = Ext.ComponentQuery.query('card_home_arduino #online')[0];

		titlebar.setTitle(data.name);

		if(data.online)
		{
			offlineContainer.hide(animation);
			onlineContainer.show(animation);

			windowspcBtn = Ext.ComponentQuery.query('card_home_arduino #windowspc')[0];
			switch2Btn = Ext.ComponentQuery.query('card_home_arduino #switch2')[0];
			switch3Btn = Ext.ComponentQuery.query('card_home_arduino #switch3')[0];
			
			if(data.values.switch1 === 'on')
			{
				windowspcBtn.setBadgeText('on');
			}
			else
			{
				windowspcBtn.setBadgeText(null);
			}

			if(data.values.switch2 === 'on')
			{
				switch2Btn.setBadgeText('on');
			}
			else
			{
				switch2Btn.setBadgeText(null);
			}

			if(data.values.switch3 === 'on')
			{
				switch3Btn.setBadgeText('on');
			}
			else
			{
				switch3Btn.setBadgeText(null);
			}
		}
		else
		{
			offlineContainer.show(animation);
			onlineContainer.hide(animation);
		}
	},

	update_windows: function(data, animation)
	{
		titlebar = Ext.ComponentQuery.query('card_home_windows titlebar')[0];
		offlineContainer = Ext.ComponentQuery.query('card_home_windows #offline')[0];
		onlineContainer = Ext.ComponentQuery.query('card_home_windows #online')[0];

		titlebar.setTitle(data.name);

		if(data.online)
		{
			offlineContainer.hide(animation);
			onlineContainer.show(animation);
		}
		else
		{
			offlineContainer.show(animation);
			onlineContainer.hide(animation);
		}
	},

	update_linux: function(data, animation)
	{
		titlebar = Ext.ComponentQuery.query('card_home_linux titlebar')[0];
		offlineContainer = Ext.ComponentQuery.query('card_home_linux #offline')[0];
		onlineContainer = Ext.ComponentQuery.query('card_home_linux #online')[0];

		titlebar.setTitle(data.name);

		if(data.online)
		{
			offlineContainer.hide(animation);
			onlineContainer.show(animation);
		}
		else
		{
			offlineContainer.show(animation);
			onlineContainer.hide(animation);
		}
	},

	get_device_id: function(deviceType)
	{
		switch(deviceType)
		{
			case 'arduino':
				return '000000000002';
				break;
			case 'windows':
				return '000000000003';
				break;
			case 'linux':
				return '000000000004';
				break;
			default:
				return '';
		}
	},

	//============ web socket operations ===========================================================
	update_socket: function() 
	{
		var msg = {
			cmd: "update_socket",
			sid: settings.sessionVal,
			data: ""
		};
		this.socket_send_msg(msg);
	},

	update_socket_success: function(data) 
	{
	},

	update_socket_error: function(data) 
	{			
		Ext.Msg.alert(data);
	},

	list_devices: function()
	{
		var msg = {
			cmd: "list_devices",
			sid: settings.sessionVal,
			data: ""
		};
		this.socket_send_msg(msg);
	},

	list_devices_success: function(data) 
	{
		for(var i=0; i< data.length; i++)
		{
			switch(data[i].type)
			{
				case "arduino":
					main.update_arduino(data[i], false);
					break;
				case "windows":
					main.update_windows(data[i], false);
					break;
				case "linux":
					main.update_linux(data[i], false);
					break;
			}
		};

		Ext.ComponentQuery.query('card_home')[0].show();
		Ext.ComponentQuery.query('card_main').removeAt(0);
		Ext.ComponentQuery.query('card_loading')[0].destroy();
	},

	list_devices_error: function(data) 
	{
		Ext.Msg.alert(data);
	},

	update_switch_status: function(deviceType, switchId, status) 
	{
		var deviceId = main.get_device_id(deviceType);
		var msg = {
			cmd: "update_switch_status",
			sid: settings.sessionVal,
			data: {"device_id": deviceId, "switch_id": switchId, "status": status}
		};
		main.socket_send_msg(msg);
	},

	update_switch_status_success: function(data) 
	{
	},

	update_switch_status_error: function(data) 
	{			
		Ext.Msg.alert(data);
	},

	send_command: function(deviceType, cmd) 
	{
		var deviceId = main.get_device_id(deviceType);
		var msg = {
			cmd: "send_command",
			sid: settings.sessionVal,
			data: {"device_id": deviceId, "cmd": cmd}
		};
		main.socket_send_msg(msg);
	},

	send_command_success: function(data) 
	{
	},

	send_command_error: function(data) 
	{			
		Ext.Msg.alert(data);
	},

	device_status_changed_success: function(data) 
	{
		switch(data.type)
		{
			case "arduino":
				main.update_arduino(data, true);
				break;
			case "windows":
				main.update_windows(data, true);
				break;
			case "linux":
				main.update_linux(data, true);
				break;
		}
	},

	//============ web socket ======================================================================
	socket_init: function()
	{
		if (window.WebSocket) settings.MyWebSocket = window.WebSocket;
		if (!settings.MyWebSocket && window.MozWebSocket) settings.MyWebSocket = window.MozWebSocket;
		if (!settings.MyWebSocket)
		{
			Ext.Msg.alert("Your browser is not supported. Please use Firefox or Google Chrome.");
		}
	},

	socket_connect: function()
	{
		var socket_on_open = function()
		{
			// upate session to the new socket PID whenever connect(re-connect)
			main.update_socket();

			main.list_devices();
		};

		var socket_on_message = function(msg)
		{
			if(msg.data)
			{
				var response = window.JSON.parse(msg.data);
				if(response.success)
				{
					main[response.cmd + "_success"].apply(this, [response.data]);
				}
				else
				{
					main[response.cmd + "_error"].apply(this, [response.data]);
				}
			}

			// log
			if(console && console.log)
			{
				console.log("received: %o", msg);
			}
		};

		var socket_on_close = function()
		{
			if(console && console.log)
			{
				console.log("Socket is closed, is reconnecting...");
			}
			window.setTimeout(function(){socket_connect();}, 6000);
		};
		
		settings.myWebSocket = new settings.MyWebSocket(settings.WebSocketUrl);
		settings.myWebSocket.onopen = socket_on_open;
		settings.myWebSocket.onmessage = socket_on_message;
		settings.myWebSocket.onclose = socket_on_close;
	},

	socket_send_msg: function(msgObj)
	{
		if(settings.myWebSocket && settings.myWebSocket.readyState === settings.myWebSocket.OPEN && msgObj)
		{
			var msg = window.JSON.stringify(msgObj);
			var sendResult = settings.myWebSocket.send(msg);
			
			if(sendResult === false)
			{
				window.setTimeout(function(){socket_send_msg(msgObj);}, 5000);
				if(console && console.log)
				{
					console.log("Communication error, is retrying...");
				}
			}
		}
		else
		{
			if(console && console.log)
			{
				console.log("Communication error, is retrying...");
			}
			window.setTimeout(function(){socket_send_msg(msgObj);}, 5000);
		}

		// log
		if(console && console.log)
		{
			console.log("sending: %o", msgObj);
		}
	}
}
