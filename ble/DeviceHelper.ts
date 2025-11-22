import { ConnectionOptions, Device, Subscription } from "react-native-ble-plx";
import { bleManagerHelper } from "./BleManagerHelper";
import {
  decodeBatteryLevelData,
  decodeTemperatureData,
  decodeTemperatureUnitData,
  encodeTemperatureUnitData,
} from "@/utils/dataDecoding";
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

      const characteristic = await this.device?.readCharacteristicForService(
        BATTERY_SERVICE,
        BATTERY_LEVEL_CHARACTERISTIC,
      );

      if (!characteristic?.value) {
        console.log("Battery level characteristic value is null or undefined");
        return null;
      }

      return decodeBatteryLevelData(characteristic.value);
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

      const characteristic = await this.device?.readCharacteristicForService(
        TEMPERATURE_SERVICE,
        TEMPERATURE_CHARACTERISTIC,
      );

      if (!characteristic?.value) {
        console.log("Temperature characteristic value is null or undefined");
        return null;
      }

      const decodedData = decodeTemperatureData(characteristic.value);

      if (!decodedData) {
        console.log("Failed to decode temperature data");
        return null;
      }

      const [temperature, humidity] = decodedData;

      return { temperature, humidity };
    } catch (error) {
      console.log("Failed to read temperature:", error);
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
            console.log("Failed to monitor temperature characteristic:", error);
            callback(null);
            return;
          }

          if (!characteristic?.value) {
            console.log(
              "Temperature characteristic value is null or undefined",
            );
            callback(null);
            return;
          }

          const decodedData = decodeTemperatureData(characteristic.value);

          if (!decodedData) {
            console.log("Failed to decode temperature data");
            callback(null);
            return;
          }

          const [temperature, humidity] = decodedData;

          callback({ temperature, humidity });
        },
      );
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

      const characteristic = await this.device?.readCharacteristicForService(
        TEMPERATURE_SERVICE,
        TEMPERATURE_UNIT_CHARACTERISTIC,
      );

      if (!characteristic?.value) {
        console.log(
          "Temperature unit characteristic value is null or undefined",
        );
        return null;
      }

      return decodeTemperatureUnitData(characteristic.value);
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

      const base64Value = encodeTemperatureUnitData(unit);

      await this.device?.writeCharacteristicWithResponseForService(
        TEMPERATURE_SERVICE,
        TEMPERATURE_UNIT_CHARACTERISTIC,
        base64Value,
      );
    } catch (error) {
      console.log("Failed to set temperature unit:", error);
    }
  }
}
