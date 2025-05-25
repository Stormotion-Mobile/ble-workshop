import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Text,
  Surface,
  Card,
  Divider,
  IconButton,
} from "react-native-paper";
import { View } from "react-native";
import { DeviceHelper } from "@/ble/DeviceHelper";

export default function DeviceScreen() {
  const { id, name, mac } = useLocalSearchParams();
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectedDevice = useRef<DeviceHelper | null>(null);

  const connectToDevice = useCallback(async () => {
    if (!id) return;

    try {
      setIsConnecting(true);
      setError(null);

      const device = await DeviceHelper.connectToDeviceById(id as string);
      console.log("Connected to device:", device);

      const climate = await device.readClimate();

      console.log("Climate data:", climate);

      setIsConnected(true);
      connectedDevice.current = device;
    } catch (err) {
      console.error("Connection error:", err);
      setError(
        `Connection failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setIsConnecting(false);
    }
  }, [id]);

  const disconnectFromDevice = useCallback(async () => {
    if (!id) return;

    try {
      await connectedDevice.current?.disconnect();
      setIsConnected(false);
    } catch (err) {
      console.error("Disconnection error:", err);
    } finally {
      connectedDevice.current = null;
    }
  }, [id]);

  useEffect(() => {
    return () => {
      connectedDevice.current?.disconnect();
    };
  }, []);

  return (
    <Surface style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          mode="contained"
          onPress={() => router.back()}
        />
        <Text variant="headlineMedium" style={styles.title}>
          Device Details
        </Text>
      </View>

      <Card style={styles.infoCard}>
        <Card.Content>
          <View style={styles.deviceNameRow}>
            {isConnected ? (
              <IconButton
                icon="bluetooth-connect"
                size={20}
                iconColor="#4caf50"
                style={styles.connectionIcon}
              />
            ) : (
              <IconButton
                icon="bluetooth-off"
                size={20}
                iconColor="#9e9e9e"
                style={styles.connectionIcon}
              />
            )}
            <Text variant="titleLarge" style={styles.deviceName}>
              {name || "Unknown Device"}
            </Text>
          </View>
          <Divider style={styles.divider} />
          <Text variant="bodyLarge">Device ID: {id}</Text>
          <Text variant="bodyLarge">MAC: {mac}</Text>
        </Card.Content>
      </Card>

      {error && (
        <Card style={styles.errorCard}>
          <Card.Content>
            <Text variant="bodyMedium" style={styles.errorText}>
              {error}
            </Text>
          </Card.Content>
        </Card>
      )}

      <View style={styles.connectionContainer}>
        {isConnected ? (
          <Button
            mode="outlined"
            onPress={disconnectFromDevice}
            icon="bluetooth-off"
            style={styles.actionButton}
          >
            Disconnect
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={connectToDevice}
            disabled={isConnecting}
            loading={isConnecting}
            icon="bluetooth"
            style={styles.actionButton}
          >
            {isConnecting ? "Connecting..." : "Connect to Device"}
          </Button>
        )}
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    flex: 1,
    textAlign: "center",
    marginRight: 40,
  },
  infoCard: {
    marginBottom: 16,
    elevation: 2,
  },
  deviceNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  connectionIcon: {
    margin: 0,
    padding: 0,
  },
  deviceName: {
    flex: 1,
  },
  divider: {
    marginVertical: 12,
  },
  errorCard: {
    backgroundColor: "#ffeeee",
    marginBottom: 16,
  },
  errorText: {
    color: "#d32f2f",
  },
  connectionContainer: {
    marginTop: 20,
  },
  actionButton: {
    marginVertical: 8,
  },
});
