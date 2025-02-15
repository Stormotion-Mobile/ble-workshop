import {useEffect} from 'react';
import {
  Platform,
  Alert,
  Linking,
  PermissionsAndroid,
} from 'react-native';

export default function useAndroidBluetoothPermissions() {
  useEffect(() => {

    async function checkAndRequestPermissions() {
      if (Platform.OS === 'android') {
        // For Android versions lower than 23, permissions are granted at install time.
        if (Platform.Version < 23) return;

        if (Platform.Version >= 31) {
          const requiredPermissions = [
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            // PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ];

          const results = await PermissionsAndroid.requestMultiple(requiredPermissions);
          const allGranted = requiredPermissions.every(
            (permission) => results[permission] === PermissionsAndroid.RESULTS.GRANTED
          )

          if (!allGranted) {
            Alert.alert(
              'Bluetooth Permission Required',
              'Bluetooth permissions are required for the app to function properly. Please enable them in Settings.',
              [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Open Settings', onPress: () => Linking.openSettings()},
              ]
            );
          }
        } else {
          const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          if (status !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert(
              'Location Permission Required',
              'Location permission is required for Bluetooth functionality. Please enable it in Settings.',
              [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Open Settings', onPress: () => Linking.openSettings()},
              ]
            );
          }
        }
      }
    }

    checkAndRequestPermissions();
  }, []);
}
