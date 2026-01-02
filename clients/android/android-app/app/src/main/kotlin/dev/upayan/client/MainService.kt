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
import android.content.SharedPreferences

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
            val prefs = getSharedPreferences("upayan", Context.MODE_PRIVATE)
            val apiHost = prefs.getString("apiHost", "https://api.upayan-v5.upayan.dev") ?: "https://api.upayan-v5.upayan.dev"
            val token = prefs.getString("token", "") ?: ""

            while (true) {
                try {
                    // simple battery & uptime reporting
                    val bm = getSystemService(BATTERY_SERVICE) as android.os.BatteryManager
                    val batteryPct = bm.getIntProperty(android.os.BatteryManager.BATTERY_PROPERTY_CAPACITY)

                    val body = mapOf(
                        "deviceId" to "android-device",
                        "battery" to batteryPct,
                        "extra" to mapOf("package" to applicationContext.packageName)
                    )

                    // network call using java.net.HttpURLConnection for minimal deps
                    val url = java.net.URL(apiHost.trimEnd('/') + "/device/data")
                    val conn = url.openConnection() as java.net.HttpURLConnection
                    conn.requestMethod = "POST"
                    conn.doOutput = true
                    conn.setRequestProperty("Content-Type", "application/json")
                    if (token.isNotEmpty()) conn.setRequestProperty("Authorization", "Bearer $token")

                    val out = conn.outputStream
                    // Build a minimal JSON payload without extra deps
                    val json = "{" +
                        "\"deviceId\":\"android-device\"," +
                        "\"battery\":$batteryPct," +
                        "\"extra\":{\"package\":\"${applicationContext.packageName}\"}" +
                        "}"
                    out.write(json.toByteArray())
                    out.flush()
                    out.close()

                    val code = conn.responseCode
                    if (code !in 200..299) {
                        Log.w("MainService", "report failed: $code")
                    }
                    conn.disconnect()

                } catch (ex: Exception) {
                    Log.e("MainService", "report error", ex)
                }
                delay(30_000)
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
