# Frontend
Expo Native React, zustand, axios

## Run normal
```bash
npx expo start

# Run and clean cache
npm start -c
```

## Add emulator tools in path (if need)
```bash
echo $ANDROID_HOME
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
// source ~/.bashrc

# Run with emulator
REACT_NATIVE_PACKAGER_HOSTNAME=localhost npx expo start

// 2nd Option
// Once per session
adb reverse tcp:8081 tcp:8081
adb reverse tcp:19000 tcp:19000
adb reverse tcp:19001 tcp:19001
// start metro
npx expo start --localhost -c
```

## Other useful commands
```bash
# Check logs
adb logcat *:S ReactNative:V ReactNativeJS:V

# Add dark mode
adb shell "cmd uimode night yes"
# Light mode
adb shell "cmd uimode night no"

## Clear cache from adb
adb shell pm clear host.exp.exponent
```