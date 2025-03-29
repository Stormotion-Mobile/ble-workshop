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
