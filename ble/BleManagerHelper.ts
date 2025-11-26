import { BleManager, ConnectionOptions, Device } from "react-native-ble-plx";

const DEVICE_NAME = "LYWSD03MMC";
const DEVICE_ADVERTISEMENT_SERVICE = "fe95"; // Xiaomi's service ID, full ID is 0000fe95-0000-1000-8000-00805f9b34fb
export const FULL_DEVICE_ADVERTISEMENT_SERVICE = `0000${DEVICE_ADVERTISEMENT_SERVICE}-0000-1000-8000-00805f9b34fb`;

class BleManagerHelper {
  private manager: BleManager;

  constructor() {
    this.manager = new BleManager();
  }

  startScan(onDeviceFoundCallback: (device: Device | null) => void) {
    // TODO: Add device scan
  }

  stopScan() {
    // TODO: Stop device scan
  }

  async connectToDevice(
    deviceId: string,
    options?: ConnectionOptions,
  ): Promise<Device> {
    // TODO: Connect to device by ID
  }

  async cancelDeviceConnection(deviceId: string): Promise<void> {
    // TODO: Disconnect from device
  }
}

export const bleManagerHelper = new BleManagerHelper();
