Ext.define('Autohome.view.Home', {
	extend: 'Ext.Carousel',
	xtype: 'card_home',
	requires: [
		'Autohome.view.home.Arduino',
		'Autohome.view.home.Windows',
		'Autohome.view.home.Linux'
	],

	config: {
		title: 'HOME',
		iconCls: 'home',
		defaults: { 
			styleHtmlContent: true,
			scrollable: false
		},
		items: [
			{ xtype: 'card_home_arduino' },
			{ xtype: 'card_home_windows' },
			{ xtype: 'card_home_linux' }
		]
	}
});
