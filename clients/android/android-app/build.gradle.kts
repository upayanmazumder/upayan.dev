plugins {
    id("com.android.application") apply false
    id("org.jetbrains.kotlin.android") apply false
}

buildscript {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

repositories {
    google()
    mavenCentral()
}

task("clean") {
    doLast {
        delete(rootProject.buildDir)
    }
}
