export type TemperatureUnit = "c" | "f";

export function convertTemperature(
  temperatureC: number,
  toUnit: TemperatureUnit,
): number {
  if (toUnit === "c") {
    return temperatureC;
  } else {
    return (temperatureC * 9) / 5 + 32;
  }
}
