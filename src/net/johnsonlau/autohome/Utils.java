package net.johnsonlau.autohome;

import android.net.NetworkInfo;
import android.net.ConnectivityManager;
import android.content.Context;

public class Utils {
	public static boolean IsNetworkAvailable(Context context)
	{
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
