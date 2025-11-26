import {
  decodeAdvertisementData,
  decodeBatteryLevelData,
  decodeTemperatureData,
  decodeTemperatureUnitData,
  encodeTemperatureUnitData,
} from "@/utils/dataDecoding";

describe("test decoding data", () => {
  test("decodeAdvertisementData", () => {
    const advertisementData = "MFhbBQFiIh44waQoAQA=";
    const result = decodeAdvertisementData(advertisementData);

    expect(result).toEqual({
      mac: "A4:C1:38:1E:22:62",
    });
  });

  test("decodeBatteryLevelData returns battery level from base64", () => {
    // single byte 50 (0x32) -> base64 "Mg=="
    const batteryLevelData = "Mg==";
    const result = decodeBatteryLevelData(batteryLevelData);

    expect(result).toBe(50);
  });

  test("decodeTemperatureData decodes positive temperature and humidity", () => {
    // bytes: [0x34, 0x09, 0x41, 0x00]
    // Int16LE(0x0934) = 2356 -> 23.56 °, humidity = 0x41 = 65
    // base64: "NAlBAA=="
    const temperatureData = "NAlBAA==";

    const result = decodeTemperatureData(temperatureData);

    expect(result).toEqual([23.56, 65]);
  });

  test("decodeTemperatureData decodes negative temperature correctly", () => {
    // bytes: [0xDA, 0xFD, 0x28, 0x00]
    // Int16LE(0xFDDA) = -550 -> -5.50 °, humidity = 0x28 = 40
    // base64: "2v0oAA=="
    const temperatureData = "2v0oAA==";

    const result = decodeTemperatureData(temperatureData);

    expect(result).toEqual([-5.5, 40]);
  });

  test("decodeTemperatureUnitData decodes Celsius", () => {
    // single byte 0 -> base64 "AA=="
    const unitData = "AA==";

    const result = decodeTemperatureUnitData(unitData);

    expect(result).toBe("c");
  });

  test("decodeTemperatureUnitData decodes Fahrenheit", () => {
    // single byte 1 -> base64 "AQ=="
    const unitData = "AQ==";

    const result = decodeTemperatureUnitData(unitData);

    expect(result).toBe("f");
  });

  test("encodeTemperatureUnitData encodes Celsius correctly", () => {
    const result = encodeTemperatureUnitData("c");

    expect(result).toBe("AA==");
  });

  test("encodeTemperatureUnitData encodes Fahrenheit correctly", () => {
    const result = encodeTemperatureUnitData("f");

    expect(result).toBe("AQ==");
  });

  test("encode + decode temperature unit roundtrip", () => {
    const encodedC = encodeTemperatureUnitData("c");
    const encodedF = encodeTemperatureUnitData("f");

    expect(decodeTemperatureUnitData(encodedC)).toBe("c");
    expect(decodeTemperatureUnitData(encodedF)).toBe("f");
  });
});
