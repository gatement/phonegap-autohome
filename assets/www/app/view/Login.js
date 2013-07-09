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
				width: '100%'
			},
			{
				xtype: 'passwordfield',
				label: 'PASSWORD',
				name: 'password',
				placeHolder: 'Enter your password',
				width: '100%'
			},
			{
				itemId: 'login',
				xtype: 'button',
				text: 'LOGIN',
				margin: 10,
				width: '90%',
				height: 50,
				ui: 'confirm',
			}
		]
	}
});
