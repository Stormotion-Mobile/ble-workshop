import {Button, FlatList, Text, View, StyleSheet} from "react-native";
import useAndroidBluetoothPermissions from "@/hooks/useAndroidBluetoothPermissions";
import {useCallback, useState} from "react";
import {Device} from "react-native-ble-plx";
import {bleManager} from "@/ble/BleManager";
import type {ListRenderItem} from "@react-native/virtualized-lists";

export default function Index() {
  useAndroidBluetoothPermissions();

  const [devices, setDevices] = useState<Device[]>([]);

  const startScan = useCallback(() => {
    console.log("Starting BLE scan");
    setDevices([]);

    // initialize scanning for BLE devices
    bleManager.startScan((device) => {
      console.log("BLE device found", device);

      if (device) {
        setDevices((prev) => {
          if (prev.some((d) => d.id === device.id)) {
            return prev;
          }

          return [...prev, device];
        });
      }
    })
  }, []);

  const stopScan = useCallback(() => {
    console.log("Stopping BLE scan");
    // stop scanning for BLE devices
    bleManager.stopScan();
  }, []);

  const renderItem = useCallback<ListRenderItem<Device>>(({item}) => {
    return (
      <View style={styles.deviceItem}>
        <Text>{`Name: ${item.name}`}</Text>
        <Text>{`ID: ${item.id}`}</Text>
        <Text>{`RSSI: ${item.rssi}`}</Text>
      </View>
    );
  }, []);

  return (
    <View
      style={styles.container}
    >
      <FlatList data={devices} renderItem={renderItem} keyExtractor={(device) => device.id}/>
      <Button title={"Start scan"} onPress={startScan}/>
      <Button title={"Stop scan"} onPress={stopScan}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  deviceItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  }
})
