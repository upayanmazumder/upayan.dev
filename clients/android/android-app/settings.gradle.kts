pluginManagement {
	repositories {
		gradlePluginPortal()
		google()
		mavenCentral()
	}
	plugins {
		id("com.android.application") version "8.1.0"
		id("org.jetbrains.kotlin.android") version "1.9.10"
	}
}

rootProject.name = "UpayanDeviceClient"
include(":app")
