package net.johnsonlau.autohome;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import android.net.NetworkInfo;
import android.net.ConnectivityManager;
import android.content.Context;
import android.util.Log;

public class Utils {
	private static final String TAG = "AutoHome";

	public static void PrintLog(String msg) {
		DateFormat dateFormat = new SimpleDateFormat("(HH:mm:ss) ");
		String timeStr = dateFormat.format(Calendar.getInstance().getTime());
		msg = timeStr + msg;

		Log.i(Utils.TAG, msg);
	}

	public static boolean IsNetworkAvailable(Context context) {
		ConnectivityManager connMgr = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
		NetworkInfo activeNetworkInfo = connMgr.getActiveNetworkInfo();
		if(activeNetworkInfo != null && activeNetworkInfo.isConnected()) {
			return true;
		}
		else {
			return false;
		}
	}
}
