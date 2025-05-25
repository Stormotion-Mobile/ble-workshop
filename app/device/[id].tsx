import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";
import { bleManager } from "@/ble/BleManager";
import { useCallback, useEffect, useState } from "react";

export default function DeviceScreen() {
  const { id, name, mac } = useLocalSearchParams();
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectToDevice = useCallback(async () => {
    if (!id) return;

    try {
      setIsConnecting(true);
      setError(null);

      const device = await bleManager.connectToDevice(id as string);
      console.log("Connected to device:", device);

      // Discover services and characteristics
      await device.discoverAllServicesAndCharacteristics();

      setIsConnected(true);
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
      await bleManager.cancelDeviceConnection(id as string);
      setIsConnected(false);
    } catch (err) {
      console.error("Disconnection error:", err);
    }
  }, [id]);

  // Clean up connection when leaving screen
  useEffect(() => {
    return () => {
      if (isConnected && id) {
        bleManager.cancelDeviceConnection(id as string).catch(console.error);
      }
    };
  }, [id, isConnected]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Device Connection</Text>
      <Text style={styles.deviceInfo}>Name: {name || "Unknown"}</Text>
      <Text style={styles.deviceInfo}>Device ID: {id}</Text>
      <Text style={styles.deviceInfo}>MAC: {mac}</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.buttonContainer}>
        {!isConnected ? (
          <Button
            title={isConnecting ? "Connecting..." : "Connect to Device"}
            onPress={connectToDevice}
            disabled={isConnecting}
          />
        ) : (
          <View>
            <Text style={styles.connectedText}>Connected</Text>
            <Button title="Disconnect" onPress={disconnectFromDevice} />
          </View>
        )}

        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  deviceInfo: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
    gap: 10,
  },
  connectedText: {
    color: "green",
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});
