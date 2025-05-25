import { ConnectionOptions, Device, Subscription } from "react-native-ble-plx";
import { bleManagerHelper } from "./BleManagerHelper";
import {
  decodeBatteryLevelData,
  decodeTemperatureData,
} from "@/utils/dataDecoding";

export const BATTERY_SERVICE = "180f";
export const BATTERY_LEVEL_CHARACTERISTIC = "2a19";

export const TEMPERATURE_SERVICE = "ebe0ccb0-7a0a-4b0c-8a1a-6ff2997da3a6";
export const TEMPERATURE_CHARACTERISTIC =
  "ebe0ccc1-7a0a-4b0c-8a1a-6ff2997da3a6";

export type Climate = {
  temperature: number;
  humidity: number;
};

export class DeviceHelper {
  private device: Device | null = null;

  private constructor(device: Device) {
    this.device = device;
  }

  static async connectToDeviceById(
    deviceId: string,
    options?: ConnectionOptions,
  ): Promise<DeviceHelper> {
    const device = await bleManagerHelper.connectToDevice(deviceId, options);

    if (!device) {
      throw new Error("Device not found or connection failed");
    }

    await device.discoverAllServicesAndCharacteristics();

    return new DeviceHelper(device);
  }

  async disconnect(): Promise<void> {
    if (!this.device) {
      console.error("No device to disconnect from");
      return;
    }

    try {
      await bleManagerHelper.cancelDeviceConnection(this.device.id);
      this.device = null;
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  }

  async isConnected(): Promise<boolean> {
    return (await this.device?.isConnected()) ?? false;
  }

  async readBatteryLevel(): Promise<string | null | undefined> {
    try {
      const isConnected = await this.isConnected();

      if (!isConnected) {
        console.error("Device is not connected");
        return null;
      }

      const characteristic = await this.device?.readCharacteristicForService(
        BATTERY_SERVICE,
        BATTERY_LEVEL_CHARACTERISTIC,
      );

      if (!characteristic?.value) {
        console.error(
          "Battery level characteristic value is null or undefined",
        );
        return null;
      }

      return decodeBatteryLevelData(characteristic.value)?.toString();
    } catch (error) {
      console.error("Failed to read battery level:", error);

      return null;
    }
  }

  async readClimate(): Promise<Climate | null | undefined> {
    try {
      const isConnected = await this.isConnected();

      if (!isConnected) {
        console.error("Device is not connected");
        return null;
      }

      const characteristic = await this.device?.readCharacteristicForService(
        TEMPERATURE_SERVICE,
        TEMPERATURE_CHARACTERISTIC,
      );

      if (!characteristic?.value) {
        console.error("Temperature characteristic value is null or undefined");
        return null;
      }

      const decodedData = decodeTemperatureData(characteristic.value);

      if (!decodedData) {
        console.error("Failed to decode temperature data");
        return null;
      }

      const [temperature, humidity] = decodedData;

      return { temperature, humidity };
    } catch (error) {
      console.error("Failed to read temperature:", error);
      return null;
    }
  }

  setClimateNotification(
    callback: (data: Climate | null) => void,
  ): Subscription | undefined | null {
    try {
      return this.device?.monitorCharacteristicForService(
        TEMPERATURE_SERVICE,
        TEMPERATURE_CHARACTERISTIC,
        (error, characteristic) => {
          if (error) {
            console.error(
              "Failed to monitor temperature characteristic:",
              error,
            );
            callback(null);
            return;
          }

          if (!characteristic?.value) {
            console.error(
              "Temperature characteristic value is null or undefined",
            );
            callback(null);
            return;
          }

          const decodedData = decodeTemperatureData(characteristic.value);

          if (!decodedData) {
            console.error("Failed to decode temperature data");
            callback(null);
            return;
          }

          const [temperature, humidity] = decodedData;

          callback({ temperature, humidity });
        },
      );
    } catch (error) {
      console.error("Failed to set temperature notification:", error);
      callback(null);
    }
  }

  // async readUnit(): Promise<"c" | "f" | null | undefined> {}

  // async setUnit(unit: "c" | "f"): Promise<void> {}
}
