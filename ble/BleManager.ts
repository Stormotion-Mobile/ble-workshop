import { BleManager, Device, ScanMode } from "react-native-ble-plx";

const DEVICE_NAME = "LYWSD03MMC";
const DEVICE_ADVERTISEMENT_SERVICE = "fe95"; // Xiaomi's service ID, full ID is 0000fe95-0000-1000-8000-00805f9b34fb
export const FULL_DEVICE_ADVERTISEMENT_SERVICE = `0000${DEVICE_ADVERTISEMENT_SERVICE}-0000-1000-8000-00805f9b34fb`;

class BLEManager {
  private manager: BleManager;

  constructor() {
    this.manager = new BleManager();
  }

  startScan(onDeviceFoundCallback: (device: Device | null) => void) {
    this.manager
      .startDeviceScan(
        [FULL_DEVICE_ADVERTISEMENT_SERVICE],
        {
          allowDuplicates: false,
          scanMode: ScanMode.LowLatency,
        },
        (error, device) => {
          if (error) {
            console.error("BLE scan error", error);

            return;
          }

          if (device?.name !== DEVICE_NAME) {
            return;
          }

          onDeviceFoundCallback(device);
        },
      )
      .then(() => {
        console.log("Scanning for BLE devices");
      })
      .catch((error) => {
        console.error("Failed to start BLE scan", error);
      });
  }

  stopScan() {
    this.manager.stopDeviceScan();
  }

  async connectToDevice(deviceId: string): Promise<Device> {
    try {
      const device = await this.manager.connectToDevice(deviceId);
      console.log("Connected to device:", device.id);
      return device;
    } catch (error) {
      console.error("Failed to connect to device", error);
      throw error;
    }
  }

  async cancelDeviceConnection(deviceId: string): Promise<void> {
    try {
      await this.manager.cancelDeviceConnection(deviceId);
      console.log("Cancelled connection to device:", deviceId);
    } catch (error) {
      console.error("Failed to cancel device connection", error);
      throw error;
    }
  }
}

export const bleManager = new BLEManager();
