import { StyleSheet, FlatList } from "react-native";
import useAndroidBluetoothPermissions from "@/hooks/useAndroidBluetoothPermissions";
import { useCallback, useState } from "react";
import { Device } from "react-native-ble-plx";
import {
  bleManagerHelper,
  FULL_DEVICE_ADVERTISEMENT_SERVICE,
} from "@/ble/BleManagerHelper";
import type { ListRenderItem } from "@react-native/virtualized-lists";
import { decodeAdvertisementData } from "@/utils/dataDecoding";
import { useRouter } from "expo-router";
import {
  Button,
  Card,
  Text,
  Surface,
  ActivityIndicator,
  Divider,
} from "react-native-paper";
import { View } from "react-native";

export default function Index() {
  useAndroidBluetoothPermissions();

  const router = useRouter();

  const [devices, setDevices] = useState<Device[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const startScan = useCallback(() => {
    console.log("Starting BLE scan");
    setDevices([]);
    setIsScanning(true);

    bleManagerHelper.startScan((device) => {
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
    setIsScanning(false);
    bleManagerHelper.stopScan();
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
        <Card
          style={styles.deviceItem}
          onPress={() =>
            onDeviceSelected({
              id: item.id,
              name: item.name || "Unknown",
              mac,
            })
          }
          mode="outlined"
        >
          <Card.Content>
            <Text variant="titleMedium">{item.name || "Unknown Device"}</Text>
            <Text variant="bodyMedium">ID: {item.id}</Text>
            <Text variant="bodyMedium">MAC: {mac}</Text>
            <Text variant="bodyMedium">Signal: {item.rssi} dBm</Text>
          </Card.Content>
        </Card>
      );
    },
    [onDeviceSelected],
  );

  return (
    <Surface style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Bluetooth Devices
      </Text>

      {isScanning && (
        <View style={styles.scanningContainer}>
          <ActivityIndicator animating={true} />
          <Text variant="bodyMedium">Scanning for devices...</Text>
        </View>
      )}

      <FlatList
        data={devices}
        renderItem={renderItem}
        keyExtractor={(device) => device.id}
        style={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {isScanning
              ? "None found yet. Scanning for devices..."
              : "No devices found. Start scanning to discover nearby devices."}
          </Text>
        }
      />

      <Divider style={styles.divider} />

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={startScan}
          disabled={isScanning}
          icon="bluetooth"
        >
          Start Scan
        </Button>
        <Button
          mode="outlined"
          onPress={stopScan}
          disabled={!isScanning}
          style={styles.stopButton}
        >
          Stop Scan
        </Button>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
  },
  list: {
    flex: 1,
  },
  deviceItem: {
    marginBottom: 8,
  },
  buttonContainer: {
    marginVertical: 16,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  stopButton: {
    marginLeft: 8,
  },
  divider: {
    marginVertical: 8,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 32,
    opacity: 0.6,
  },
  scanningContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    gap: 8,
  },
});
