package dev.upayan.client

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder
import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

/**
 * Minimal ForegroundService skeleton. Integrate into a full Android app.
 * Use Retrofit for the network calls and SharedPreferences for config.
 */
class MainService : Service() {
    private val scope = CoroutineScope(Job() + Dispatchers.IO)
    private val channelId = "device_status_channel"

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        val notification: Notification = Notification.Builder(this, channelId)
            .setContentTitle("Device Status")
            .setContentText("Reporting device status...")
            .build()
        startForeground(1, notification)

        scope.launch {
            while (true) {
                try {
                    // TODO: collect battery, wifi, ram, uptime, model
                    // TODO: send POST to https://<MY_API>/device/update with Bearer token from SharedPreferences
                } catch (ex: Exception) {
                    Log.e("MainService", "report error", ex)
                }
                delay(30_000) // 30s
            }
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        super.onDestroy()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val nm = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            val chan = NotificationChannel(channelId, "Device Status", NotificationManager.IMPORTANCE_LOW)
            nm.createNotificationChannel(chan)
        }
    }
}
