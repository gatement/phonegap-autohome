Ext.define('Autohome.controller.Login', {
	extend: 'Ext.app.Controller',

	config: {
		refs: {
			loginBtn: 'card_login #login',
			loginForm: 'card_login',
			remNameCheck: 'card_login #rem_name',
			remPwdCheck: 'card_login #rem_pwd'
		},
		control: {
			loginBtn: {
				tap: 'login'
			}
		},
	},

	login: function()
	{
		var me = this;

		var values = this.getLoginForm().getValues();
		if(values.username == '' || values.password == '')
		{
			Ext.Msg.alert('name and password is required.');
		}
		else
		{
			Ext.data.JsonP.request({
				url: settings.JsonpUrls['get_user_session'],
				callbackKey: 'callback',
				disableCaching: true,
				params: {
					id: values.username,
					pwd: values.password
				},
				success: function(response, request) {
					if(response.success)
					{
						if(typeof(Storage) == 'undefined')
						{
							Ext.Msg.alert('Your browser is not supported saving the credentials. Firefox or Chrome is recommended.');
						}
						else
						{
							if(me.getRemNameCheck().isChecked())
							{
								window.localStorage.login_name = values.username;
							}
							else
							{
								window.localStorage.removeItem('login_name');
							}
							if(me.getRemPwdCheck().isChecked())
							{
								window.localStorage.login_pwd = values.password;
							}
							else
							{
								window.localStorage.removeItem('login_pwd');
							}
						}
						main.login_success(response.data);
					}
					else
					{
						Ext.Msg.alert('wrong name and password.');
					}
				},
				failure: function() {
					Ext.Msg.alert('authenticate user failed.');
				}
			});
		}
	}
});

