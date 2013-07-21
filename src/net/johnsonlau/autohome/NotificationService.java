package net.johnsonlau.autohome;

import java.lang.Thread;
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
import android.util.Log;
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
	private Notification mNotification = null;
	private int mNotificationIcon = R.drawable.notification_icon;
	private int mNotificationId = 0;

	public boolean mMqttConnected = false;
	public MqttClient mMqttClient = null;
	public String mMqttClientId = null;
	final public String mMqttConnectionString = "tcp://tools.johnson.uicp.net:1883";
	final public boolean mMqttCleanStart = true;
	final public short mMqttKeepalive = 1200;

	private Timer mTimer = null;
	private TimerTask mTimerTask;

	// =============================================================
	// @Override
	// =============================================================
	
	@Override
	public void onCreate() {
		// init notifacation
		mNotification = new Notification();
		mNotification.icon = mNotificationIcon;
		mNotification.defaults = Notification.DEFAULT_ALL;
		mNotification.flags = Notification.FLAG_AUTO_CANCEL;
		mNotificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

		// init mqtt clientId
		mMqttClientId = getLocalMacAddress();

		// init mqtt client
		try{
			mMqttClient = new MqttClient(mMqttConnectionString);
			mMqttClient.registerSimpleHandler(new MyMqttSimpleCallback());
			Log.i(NotificationService.TAG, "inited mqtt client");
		} catch (MqttException e) {
			Log.i(NotificationService.TAG, "init mqtt client EXCEPTION");
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
				//showNotification("Client id: " + mMqttClientId);
			}
			else if (intent.getAction().equals("exit")){
				this.stopSelf();
				Log.i(NotificationService.TAG, "NotificationService exit");
			}
		}

		return START_STICKY;
	}

	@Override
	public void onDestroy() {
		stopTimer();
		if(mMqttConnected) {
			try {
				mMqttClient.disconnect();			
			} catch (MqttPersistenceException ex) {
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
			Log.i(NotificationService.TAG, "mqtt conn lost");
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
			Log.i(NotificationService.TAG, thisTopicName);
			String[] items = thisTopicName.split("/");

			if(items.length == 3 && (items[2].equals("online") || items[2].equals("offline"))){
				String deviceName = "";
				if(items[1].equals("000000000002")){
					deviceName = "Arduino";
				}
				else if(items[1].equals("000000000003")){
					deviceName = "Windows";
				}
				else if(items[1].equals("000000000004")){
					deviceName = "Linux";
				}
				else {
					deviceName = items[1];
				}

				String msg = deviceName + " is " + items[2];
				showNotification(msg);
			}
			else
			{
				showNotification(thisTopicName);
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
			Log.i(NotificationService.TAG, "try connecting mqtt broker");
			try {
				if(Utils.IsNetworkAvailable(this)) {
					mMqttClient.connect(mMqttClientId, mMqttCleanStart, mMqttKeepalive);
					mMqttConnected = true;
					stopTimer();
					result = true;
					Log.i(NotificationService.TAG, "mqtt is connected");
				}
				else {
					Log.i(NotificationService.TAG, "network is NOT available");
				}
			} catch (MqttException e) {
				mMqttConnected = false;
				Log.i(NotificationService.TAG, "connect mqtt broker EXCEPTION");
			}
		}

		return result;
	}

	private void showNotification(String msg) {
		showNotification(msg, "message");
	}

	private void showNotification(String msg, String title) {
		try {
			if (msg != null && !"".equals(msg)) {
				PendingIntent pendingIntent = buildPendingIntent(msg);
				mNotification.tickerText = msg;
				mNotification.setLatestEventInfo(NotificationService.this, title, msg, pendingIntent);
				mNotificationManager.notify(mNotificationId++, mNotification);
			}
		} catch (Exception e) {
			Log.i(NotificationService.TAG, e.getMessage());
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
			Log.i(NotificationService.TAG, "stop timer");
			mTimer.cancel();
			mTimer.purge();
		}
	}

	private void startTimer() {
		stopTimer();

		mTimer = new Timer(true);

		Log.i(NotificationService.TAG, "start timer");
		long delay = 5000;
		long period = 60000;
		mTimer.schedule(new MyTimerTask(), delay, period);
	}
}