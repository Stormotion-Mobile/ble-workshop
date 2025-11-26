import { ConnectionOptions, Device, Subscription } from "react-native-ble-plx";
import { bleManagerHelper } from "./BleManagerHelper";
import { TemperatureUnit } from "@/utils/unit";

export const BATTERY_SERVICE = "180f";
export const BATTERY_LEVEL_CHARACTERISTIC = "2a19";

export const TEMPERATURE_SERVICE = "ebe0ccb0-7a0a-4b0c-8a1a-6ff2997da3a6";
export const TEMPERATURE_CHARACTERISTIC =
  "ebe0ccc1-7a0a-4b0c-8a1a-6ff2997da3a6";

export const TEMPERATURE_UNIT_CHARACTERISTIC =
  "ebe0ccbe-7a0a-4b0c-8a1a-6ff2997da3a6";

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
      console.log("No device to disconnect from");
      return;
    }

    try {
      await bleManagerHelper.cancelDeviceConnection(this.device.id);
      this.device = null;
    } catch (error) {
      console.log("Failed to disconnect:", error);
    }
  }

  async isConnected(): Promise<boolean> {
    return (await this.device?.isConnected()) ?? false;
  }

  async readBatteryLevel(): Promise<number | null | undefined> {
    try {
      const isConnected = await this.isConnected();

      if (!isConnected) {
        console.log("Device is not connected");
        return null;
      }

      // TODO: Read and decode battery level characteristic
    } catch (error) {
      console.log("Failed to read battery level:", error);

      return null;
    }
  }

  async readClimate(): Promise<Climate | null | undefined> {
    try {
      const isConnected = await this.isConnected();

      if (!isConnected) {
        console.log("Device is not connected");
        return null;
      }

      // TODO: Read and decode temperature characteristic
    } catch (error) {
      console.log("Failed to read temperature:", error);
      return null;
    }
  }

  setClimateNotification(
    callback: (data: Climate | null) => void,
  ): Subscription | undefined | null {
    try {
      // TODO: Set up notification for temperature characteristic
    } catch (error) {
      console.log("Failed to set temperature notification:", error);
      callback(null);
    }
  }

  async readTemperatureUnit(): Promise<TemperatureUnit | null | undefined> {
    try {
      const isConnected = await this.isConnected();

      if (!isConnected) {
        console.log("Device is not connected");
        return null;
      }

      // TODO: Read and decode temperature unit characteristic
    } catch (error) {
      console.log("Failed to read temperature unit:", error);
      return null;
    }
  }

  async setTemperatureUnit(unit: TemperatureUnit): Promise<void> {
    try {
      const isConnected = await this.isConnected();

      if (!isConnected) {
        console.log("Device is not connected");
        return;
      }

      // TODO: Encode and write temperature unit characteristic
    } catch (error) {
      console.log("Failed to set temperature unit:", error);
    }
  }
}
