package net.johnsonlau.autohome;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.os.IBinder;
import android.os.Vibrator;
import android.util.Log;

public class ServiceMessage extends Service {
	private static final String TAG = "AutoHome_ServiceMessage";
	
	private static final String MqttServer = "tools.johnson.uicp.net";
	private static final int MqttPort = 1883;
	
	private String mUserId = "admin";
	private String mPassword = "admin";

	private MessageThread mMessageThread = null;

	private String mMessageTitle = "message";
	private int mNotificationIcon = R.drawable.notification_icon;
	private int mNotificationID = 0;

	private Notification mNotification = null;
	private NotificationManager mNotificatioManager = null;

	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
		if (mMessageThread == null) {
			mNotification = new Notification();
			mNotification.icon = mNotificationIcon;
			mNotification.defaults = Notification.DEFAULT_SOUND;
			mNotification.flags = Notification.FLAG_AUTO_CANCEL;
			mNotificatioManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

			mMessageThread = new MessageThread();
			mMessageThread.start();
		}
		return START_STICKY;
	}

	private class MessageThread extends Thread {
		public void run() {
			//startReceiveMsg();
		}
	}

	private void startReceiveMsg() {
		try {
			while (true) {
				//Thread.sleep(10000);
				String messageString = "windows is online.";
				if (messageString != null && !"".equals(messageString)) {
					PendingIntent pendingIntent = buildPendingIntent(messageString);
					mNotification.tickerText = messageString;
					mNotification.setLatestEventInfo(ServiceMessage.this, mMessageTitle, messageString, pendingIntent);
					mNotificatioManager.notify(mNotificationID++, mNotification);
					((Vibrator) getSystemService(Context.VIBRATOR_SERVICE)).vibrate(1000);
				}
			}
		} catch (Exception e) {
			Log.i(ServiceMessage.TAG, e.getMessage());
		}
	}

	private PendingIntent buildPendingIntent(String message) {
		Intent intent = new Intent(this, AutoHome.class);
		intent.putExtra("Message", message);

		PendingIntent pendingIntent = PendingIntent.getActivity(this, 0,
				intent, PendingIntent.FLAG_UPDATE_CURRENT);

		return pendingIntent;
	}

	@Override
	public void onDestroy() {
		System.exit(0);
		super.onDestroy();
	}

	@Override
	public IBinder onBind(Intent intent) {
		return null;
	}
}
