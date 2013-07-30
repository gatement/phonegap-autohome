package net.johnsonlau.autohome;

import java.lang.Thread;
import java.lang.String;
import java.nio.charset.Charset;
import java.lang.InterruptedException;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.os.IBinder;
import android.os.Vibrator;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import java.util.Timer;
import java.util.TimerTask;

import com.ibm.mqtt.MqttClient;
import com.ibm.mqtt.MqttException;
import com.ibm.mqtt.MqttPersistenceException;
import com.ibm.mqtt.MqttSimpleCallback;

public class NotificationService extends Service {
	private static final String TAG = "AutoHome";

	private MessageThread mMessageThread = null;

	private NotificationManager mNotificationManager = null;
	private int mNotificationId = 2;

	public boolean mMqttConnected = false;
	public MqttClient mMqttClient = null;
	public String mMqttClientId = null;
	final public String mMqttConnectionString = "tcp://tools.johnson.uicp.net:1883";
	final public boolean mMqttCleanStart = true;
	final public short mMqttKeepalive = 60;

	private Timer mTimer = null;
	private TimerTask mTimerTask;

	// =============================================================
	// @Override
	// =============================================================
	
	@Override
	public void onCreate() {
		// init notifacationManager
		mNotificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

		// init mqtt clientId
		mMqttClientId = getLocalMacAddress();

		// init mqtt client
		try{
			mMqttClient = new MqttClient(mMqttConnectionString);
			mMqttClient.registerSimpleHandler(new MyMqttSimpleCallback());
			Utils.PrintLog("inited mqtt client");
		} catch (MqttException e) {
			Utils.PrintLog("init mqtt client EXCEPTION");
		}

		// start thread
		mMessageThread = new MessageThread();
		mMessageThread.start();
	}

	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
		if(intent != null)
		{
			if(intent.getAction().equals("init")){
				//showNotification(mMqttClientId, true);
			}
			else if (intent.getAction().equals("exit")){
				this.stopSelf();
				Utils.PrintLog("NotificationService exit");
			}
		}

		return START_STICKY;
	}

	@Override
	public void onDestroy() {
		stopTimer();
		if(mMqttConnected) {
			try {
				Utils.PrintLog("disconncting mqtt");
				mMqttClient.disconnect();			
				Utils.PrintLog("disconncted mqtt");
			} catch (MqttPersistenceException ex) {
				Utils.PrintLog("disconnct mqtt EXCEPTION");
			}
		}
	}

	@Override
	public IBinder onBind(Intent intent) {
		return null;
	}
	
	// =============================================================
	// Class & Interface
	// =============================================================

	private class MessageThread extends Thread {
		public void run() {
			startTimer();
		}
	}

	private class MyMqttSimpleCallback implements MqttSimpleCallback {
		@Override
		public void connectionLost() throws java.lang.Exception {
			Utils.PrintLog("mqtt conn lost");
			mMqttConnected = false;
			startTimer();
			throw new Exception("mqtt conn lost");
		}

		@Override
		public void publishArrived(String thisTopicName, 
				byte[] thisPayload, 
				int Qos, 
				boolean retained) 
				throws java.lang.Exception
		{
			Utils.PrintLog(thisTopicName);
			String[] items = thisTopicName.split("/");

			if(items.length == 3 && items[2].equals("msg")){
				String msg = new String(thisPayload, Charset.forName("UTF-8"));
				showNotification(msg);
			}
			else if(items.length == 3 && items[2].equals("persistence_msg")){
				String msg = new String(thisPayload, Charset.forName("UTF-8"));
				showNotification(msg, true);
			}
			else
			{
				String msg = thisTopicName;
				showNotification(msg);
			}
		}
	}	

	private class MyTimerTask extends TimerTask {
		@Override
		public void run() {
			connectMqttBroker();
		}
	}
	
	// =============================================================
	// Helpers
	// =============================================================

	private boolean connectMqttBroker() {
		boolean result = false;
		if(mMqttConnected == false) {
			Utils.PrintLog("try connecting mqtt broker");
			try {
				if(Utils.IsNetworkAvailable(this)) {
					mMqttClient.connect(mMqttClientId, mMqttCleanStart, mMqttKeepalive);
					mMqttConnected = true;
					stopTimer();
					result = true;
					Utils.PrintLog("mqtt is connected");
				}
				else {
					Utils.PrintLog("network is NOT available");
				}
			} catch (MqttException e) {
				mMqttConnected = false;
				Utils.PrintLog("connect mqtt broker EXCEPTION");
			}
		}

		return result;
	}

	private void showNotification(String msg) {
		showNotification(msg, "AutoHome", false);
	}

	private void showNotification(String msg, boolean noClear) {
		showNotification(msg, "AutoHome", noClear);
	}

	private void showNotification(String msg, String title, boolean noClear) {
		try {
			if (msg != null && !"".equals(msg)) {
				PendingIntent pendingIntent = buildPendingIntent(msg);

				Notification notification = new Notification();
				notification.icon = R.drawable.logo;
				notification.defaults = Notification.DEFAULT_ALL;
				notification.tickerText = msg;
				notification.setLatestEventInfo(NotificationService.this, title, msg, pendingIntent);
				int notificationId = 0; 
				if(noClear)
				{
					notification.flags = Notification.FLAG_NO_CLEAR;
					notificationId = 1;
				}
				else
				{
					notification.flags = Notification.FLAG_AUTO_CANCEL;
					notificationId = mNotificationId++;
				}

				mNotificationManager.notify(notificationId, notification);
			}
		} catch (Exception e) {
			Utils.PrintLog(e.getMessage());
		}
	}

	private PendingIntent buildPendingIntent(String message) {
		Intent intent = new Intent(this, AutoHome.class);
		intent.putExtra("Message", message);

		PendingIntent pendingIntent = PendingIntent.getActivity(this, 0,
				intent, PendingIntent.FLAG_UPDATE_CURRENT);

		return pendingIntent;
	}

	public String getLocalMacAddress() {  
		WifiManager wifi = (WifiManager) getSystemService(Context.WIFI_SERVICE);  
		WifiInfo info = wifi.getConnectionInfo();  
		return info.getMacAddress().replace(":", "");  
	} 

	private void stopTimer() {
		if(mTimer != null) {
			Utils.PrintLog("stop timer");
			mTimer.cancel();
			mTimer.purge();
		}
	}

	private void startTimer() {
		stopTimer();

		mTimer = new Timer(true);

		Utils.PrintLog("start timer");
		long delay = 5000;
		long period = 60000;
		mTimer.schedule(new MyTimerTask(), delay, period);
	}
}
