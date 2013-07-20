package net.johnsonlau.autohome;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.NetworkInfo;
import android.net.ConnectivityManager;
import android.util.Log;

public class MyBroadcastReceiver extends BroadcastReceiver {
	private static final String TAG = "AutoHome";
	private static final String BOOT_COMPLETED = "android.intent.action.BOOT_COMPLETED";
	private static final String CONNECTIVITY_CHANGE = "android.net.conn.CONNECTIVITY_CHANGE"; 

	@Override
	public void onReceive(Context context, Intent intent) {
		Log.i(MyBroadcastReceiver.TAG, "broadcast: " + intent.getAction());

		if(intent.getAction().equals(MyBroadcastReceiver.BOOT_COMPLETED)){
			if(Utils.IsNetworkAvailable(context)) {
				context.startService(new Intent("init", null, context, NotificationService.class));
			}
		}

		else if(intent.getAction().equals(MyBroadcastReceiver.CONNECTIVITY_CHANGE)){
			if(Utils.IsNetworkAvailable(context)) {
				context.startService(new Intent("init", null, context, NotificationService.class));
			}
			else {
				context.startService(new Intent("exit", null, context, NotificationService.class));
			}
		}
	}
}
