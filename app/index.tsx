import {
  Button,
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import useAndroidBluetoothPermissions from "@/hooks/useAndroidBluetoothPermissions";
import { useCallback, useState } from "react";
import { Device } from "react-native-ble-plx";
import {
  bleManager,
  FULL_DEVICE_ADVERTISEMENT_SERVICE,
} from "@/ble/BleManager";
import type { ListRenderItem } from "@react-native/virtualized-lists";
import { decodeAdvertisementData } from "@/utils/dataDecoding";
import { useRouter } from "expo-router";

export default function Index() {
  useAndroidBluetoothPermissions();

  const router = useRouter();

  const [devices, setDevices] = useState<Device[]>([]);

  const startScan = useCallback(() => {
    console.log("Starting BLE scan");
    setDevices([]);

    bleManager.startScan((device) => {
      console.log("BLE device found", device);

      if (device) {
        setDevices((prev) => {
          const updatedDevices = [...prev];
          const index = updatedDevices.findIndex((d) => d.id === device.id);

          if (index !== -1) {
            updatedDevices[index] = device;
          } else {
            updatedDevices.push(device);
          }

          // sort devices by RSSI so that the strongest signal (least negative) is at the top
          return updatedDevices.sort(
            (a, b) => (b.rssi ?? -100) - (a.rssi ?? -100),
          );
        });
      }
    });
  }, []);

  const stopScan = useCallback(() => {
    console.log("Stopping BLE scan");
    // stop scanning for BLE devices
    bleManager.stopScan();
  }, []);

  const onDeviceSelected = useCallback<
    (params: { id: string; name: string; mac: string }) => void
  >(
    ({ id, name, mac }) => {
      stopScan();

      router.push({
        pathname: `/device/${id}`,
        params: {
          name: name || "Unknown",
          mac: mac,
        },
      });
    },
    [router, stopScan],
  );

  const renderItem = useCallback<ListRenderItem<Device>>(
    ({ item }) => {
      const serviceData = item.serviceData?.[FULL_DEVICE_ADVERTISEMENT_SERVICE];
      const mac = serviceData
        ? decodeAdvertisementData(serviceData).mac
        : "Unknown";

      return (
        <TouchableOpacity
          style={styles.deviceItem}
          onPress={() =>
            onDeviceSelected({
              id: item.id,
              name: item.name || "Unknown",
              mac,
            })
          }
        >
          <Text>{`Name: ${item.name}`}</Text>
          <Text>{`ID: ${item.id}`}</Text>
          <Text>{`MAC: ${mac}`}</Text>
          <Text>{`RSSI: ${item.rssi}`}</Text>
        </TouchableOpacity>
      );
    },
    [onDeviceSelected],
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={devices}
        renderItem={renderItem}
        keyExtractor={(device) => device.id}
      />
      <Button title={"Start scan"} onPress={startScan} />
      <Button title={"Stop scan"} onPress={stopScan} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  deviceItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
});
