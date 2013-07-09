Ext.define('Autohome.controller.Login', {
	extend: 'Ext.app.Controller',

	config: {
		refs: {
			loginBtn: 'card_login #login',
			loginForm: 'card_login',
		},
		control: {
			loginBtn: {
				tap: 'login'
			}
		},
	},

	login: function()
	{
		var values = this.getLoginForm().getValues();
		if(values.username == '' || values.password == '')
		{
			Ext.Msg.alert('name and password is required.');
		}
		else
		{
			Ext.data.JsonP.request({
				url: settings.GetUserSessionUrl,
				callbackKey: 'callback',
				disableCaching: true,
				params: {
					id: values.username,
					pwd: values.password
				},
				success: function(result, request) {
					if(result.success)
					{
						main.login_success(result.data);
					}
					else
					{
						Ext.Msg.alert('wrong name and password.');
					}
				}
			});
		}
	}
});

