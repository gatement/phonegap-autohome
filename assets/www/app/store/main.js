var main = {
	login_success: function(sessionId)
	{
		settings.sessionVal = sessionId;

		Ext.ComponentQuery.query('card_login')[0].destroy();
		Ext.Viewport.add({
			xclass: 'Autohome.view.Main' 
		});
		
		if(localStorage.conn_type == undefined || localStorage.conn_type == 'jsonp')
		{
			main.list_devices();
		}
		else
		{
			main.socket_init();
			main.socket_connect();
		}
	},

	//============ helpers ======================================================================
	update_arduino: function(data, animation)
	{
		var offlineContainer = Ext.ComponentQuery.query('card_arduino #offline')[0];
		var onlineContainer = Ext.ComponentQuery.query('card_arduino #online')[0];

		if(data.online)
		{
			offlineContainer.hide(animation);
			onlineContainer.show(animation);

			windowspcBtn = Ext.ComponentQuery.query('card_arduino #windowspc')[0];
			switch2Btn = Ext.ComponentQuery.query('card_arduino #switch2')[0];
			switch3Btn = Ext.ComponentQuery.query('card_arduino #switch3')[0];
			
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
		var offlineContainer = Ext.ComponentQuery.query('card_windows #offline')[0];
		var onlineContainer = Ext.ComponentQuery.query('card_windows #online')[0];

		if(data.online)
		{
			offlineContainer.hide(animation);
			onlineContainer.show(animation);

			var uptimeLabel = Ext.ComponentQuery.query('card_windows #uptime')[0];
			uptimeLabel.setHtml('Uptime: ' + data.values.uptime + ' minutes');
		}
		else
		{
			offlineContainer.show(animation);
			onlineContainer.hide(animation);
		}
	},

	update_linux: function(data, animation)
	{
		var offlineContainer = Ext.ComponentQuery.query('card_linux #offline')[0];
		var onlineContainer = Ext.ComponentQuery.query('card_linux #online')[0];

		if(data.online)
		{
			offlineContainer.hide(animation);
			onlineContainer.show(animation);

			var uptimeLabel = Ext.ComponentQuery.query('card_linux #uptime')[0];
			uptimeLabel.setHtml('Uptime: ' + data.values.uptime + ' minutes');
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

	send_msg: function(msgObj)
	{
		if(localStorage.conn_type == undefined || localStorage.conn_type == 'jsonp')
		{
			main.jsonp_send_msg(msgObj);
		}
		else
		{
			main.socket_send_msg(msgObj);
		}
	},

	//============ operations ===========================================================
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
		Ext.ComponentQuery.query('card_arduino #loading')[0].show();
		Ext.ComponentQuery.query('card_arduino #online')[0].hide();
		Ext.ComponentQuery.query('card_arduino #offline')[0].hide();
		
		Ext.ComponentQuery.query('card_windows #loading')[0].show();
		Ext.ComponentQuery.query('card_windows #online')[0].hide();
		Ext.ComponentQuery.query('card_windows #offline')[0].hide();

		Ext.ComponentQuery.query('card_linux #loading')[0].show();
		Ext.ComponentQuery.query('card_linux #online')[0].hide();
		Ext.ComponentQuery.query('card_linux #offline')[0].hide();

		var msg = {
			cmd: "list_devices",
			sid: settings.sessionVal,
			data: ""
		};
		this.send_msg(msg);
	},

	list_devices_success: function(data) 
	{
		Ext.ComponentQuery.query('card_arduino #loading')[0].hide();
		Ext.ComponentQuery.query('card_windows #loading')[0].hide();
		Ext.ComponentQuery.query('card_linux #loading')[0].hide();

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
		main.send_msg(msg);
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
		main.send_msg(msg);
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
	
	//============ jsonp ===========================================================================
	jsonp_send_msg: function(msgObj)
	{
		var data = window.JSON.stringify(msgObj.data);
		var url = settings.JsonpUrls[msgObj.cmd];

		Ext.data.JsonP.request({
			url: url,
			callbackKey: 'callback',
			disableCaching: true,
			params: {
				sid: msgObj.sid,
				data: data
			},
			success: function(response, request) {
				if(response.success)
				{
					main[msgObj.cmd + "_success"].apply(this, [response.data]);
				}
				else
				{
					main[msgObj.cmd + "_error"].apply(this, [response.data]);
				}
			},
			failure: function() {
				Ext.Msg.alert('operation failed.');
			}
		});

		// log
		if(console && console.log)
		{
			console.log("sending: %o", msgObj);
		}
	},

	//============ web socket ======================================================================
	socket_init: function()
	{
		if (window.WebSocket) settings.MyWebSocket = window.WebSocket;
		if (!settings.MyWebSocket && window.MozWebSocket) settings.MyWebSocket = window.MozWebSocket;
		if (!settings.MyWebSocket)
		{
			Ext.Msg.alert("Your browser is not supported websocket. Firefox or Chrome is recommended.");
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
			window.setTimeout(function(){main.socket_connect();}, 6000);
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
				window.setTimeout(function(){main.socket_send_msg(msgObj);}, 5000);
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
			window.setTimeout(function(){main.socket_send_msg(msgObj);}, 5000);
		}

		// log
		if(console && console.log)
		{
			console.log("sending: %o", msgObj);
		}
	}
}
