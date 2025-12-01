Add required dependencies to your Android `build.gradle`:

```gradle
dependencies {
  implementation 'com.squareup.retrofit2:retrofit:2.9.0'
  implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
  implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.6.0'
}
```

Manifest service entry example:

```xml
<service android:name=".MainService" android:exported="false" />
```
