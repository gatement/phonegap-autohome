Ext.define('Autohome.view.Login', {
	extend: 'Ext.form.Panel',
	xtype: 'card_login',

	config: {
		title: 'LOGIN',
		iconCls: 'user',
		fullscreen: true,
		layout: {
			type: 'vbox',
			align: 'middle'
		},
		defaults: {
			labelAlign: 'left',
			labelWidth: '33%'
		},
		items: [
			{
				xtype: 'label',
				html: '<h2>PLEASE LOGIN</h2>',
				margin: 15
			},
			{
				xtype: 'textfield',
				label: 'NAME',
				name: 'username',
				placeHolder: 'Enter your name',
				autoComplete: true,
				value: window.localStorage.login_name,
				width: '100%'
			},
			{
				xtype: 'passwordfield',
				label: 'PWD',
				name: 'password',
				placeHolder: 'Enter your password',
				value: window.localStorage.login_pwd,
				width: '100%'
			},
			{
				xtype: 'checkboxfield',
				itemId: 'rem_name',
				name: 'remember name',
				label: 'REM NAME',
				checked: window.localStorage.login_name != undefined,
				width: '100%'
			},
			{
				xtype: 'checkboxfield',
				itemId: 'rem_pwd',
				name: 'remember password',
				label: 'REM PWD',
				checked: window.localStorage.login_pwd != undefined,
				width: '100%'
			},
			{
				itemId: 'login',
				xtype: 'button',
				docked: 'bottom',
				text: 'LOGIN',
				margin: 10,
				width: '90%',
				height: 50,
				ui: 'action',
			}
		]
	}
});
