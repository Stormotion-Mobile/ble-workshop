import { decodeAdvertisementData } from "@/utils/dataDecoding";

describe("test decoding advertisement data", () => {
  test("test decodeAdvertisementData", () => {
    const advertisementData = "MFhbBQFiIh44waQoAQA=";
    const result = decodeAdvertisementData(advertisementData);

    expect(result).toEqual({
      mac: "A4:C1:38:1E:22:62",
    });
  });
});
