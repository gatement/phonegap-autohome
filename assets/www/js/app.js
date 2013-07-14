if(typeof(settings) === 'undefined') {
	settings = {};
}
settings.sessionVal = null;
settings.MyWebSocket = null;
settings.myWebSocket = null;

settings.WebSocketUrl = "wss://tools.johnson.uicp.net:88/device/socket";

var baseUrl = 'https://tools.johnson.uicp.net:88';

settings.JsonpUrls = {};
settings.JsonpUrls['get_user_session'] = baseUrl + '/user/session/jsonp';
settings.JsonpUrls['list_devices'] = baseUrl + '/device/device/list/jsonp';
settings.JsonpUrls['update_switch_status'] = baseUrl + '/device/switch/update/jsonp';
settings.JsonpUrls['send_command'] = baseUrl + '/device/command/send/jsonp';

function app_start() {
	Ext.application({
		name: "Autohome",

		requires: [
		'Autohome.view.Login',
		'Autohome.view.Main',
		'Autohome.view.Arduino',
		'Autohome.view.Windows',
		'Autohome.view.Linux',
		'Autohome.view.Settings'
		],

		views: [
		'Login',
		'Main',
		'Arduino',
		'Windows',
		'Linux',
		'Settings'
		],

		controllers: [
		'Login',
		'Main',
		'Arduino', 
		'Windows', 
		'Linux',
		'Settings'
		],

		launch: function() {
			Ext.Viewport.add({
				xclass: 'Autohome.view.Login' 
			});
		}
	});
}

