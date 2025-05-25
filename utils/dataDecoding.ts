import { Buffer } from "buffer";

export function base64ToBuffer(base64: string): Buffer {
  return Buffer.from(base64, "base64");
}

type AdvertisementData = {
  mac: string;
};

// advertisementData has mac address in 5th to 11th byte in little endian format
// <Buffer 30 58 5b 05 01 62 22 1e 38 c1 a4 28 01 00>
//                        ^^^^^^^^^^^^^^^^^ - reversed mac address
export function decodeAdvertisementData(
  advertisementData: string,
): AdvertisementData {
  const data = base64ToBuffer(advertisementData);
  const macRaw = data.reverse().toString("hex", 3, 9);
  const macFormatted = macRaw.match(/.{1,2}/g)?.join(":") ?? "";

  return {
    mac: macFormatted.toUpperCase(),
  };
}

export function decodeBatteryLevelData(
  batteryLevelData: string,
): number | null {
  const data = base64ToBuffer(batteryLevelData);

  if (data.length < 1) {
    console.error("Invalid battery level data length");
    return null;
  }

  return data.readUInt8(0);
}

export function decodeTemperatureData(
  temperatureData: string,
): [number, number] | null {
  const data = base64ToBuffer(temperatureData);

  console.log("Decoding temperature data:", data);

  if (data.length < 4) {
    console.error("Invalid temperature data length");
    return null;
  }

  const temperature = data.readInt16LE(0) / 100;
  const humidity = data.readUInt8(2);

  return [temperature, humidity];
}
