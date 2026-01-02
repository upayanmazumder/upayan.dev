package dev.upayan.client

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import android.widget.Button
import android.widget.EditText
import android.widget.TextView

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val startBtn = findViewById<Button>(R.id.startBtn)
        val stopBtn = findViewById<Button>(R.id.stopBtn)
        val apiInput = findViewById<EditText>(R.id.apiInput)
        val keyInput = findViewById<EditText>(R.id.keyInput)
        val status = findViewById<TextView>(R.id.status)

        // load defaults
        apiInput.setText("https://api.upayan-v5.upayan.dev")

        startBtn.setOnClickListener {
            // Save inputs to SharedPreferences then start service
            val prefs = getSharedPreferences("upayan", MODE_PRIVATE)
            prefs.edit().putString("apiHost", apiInput.text.toString()).apply()
            prefs.edit().putString("token", keyInput.text.toString()).apply()

            startService(Intent(this, MainService::class.java))
            status.text = "Reporting started"
        }

        stopBtn.setOnClickListener {
            stopService(Intent(this, MainService::class.java))
            status.text = "Stopped"
        }
    }
}
