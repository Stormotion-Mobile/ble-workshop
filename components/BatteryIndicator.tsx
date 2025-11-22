import React from "react";
import { View, StyleSheet } from "react-native";

type BatteryProps = {
  level: number;
  width?: number;
  height?: number;
};

export function BatteryIndicator({
  level,
  width = 60,
  height = 24,
}: BatteryProps) {
  const clamped = Math.max(0, Math.min(100, level));

  let segments = 1;
  if (clamped >= 66) segments = 3;
  else if (clamped >= 33) segments = 2;
  else segments = 1;

  const activeColor = segments === 1 ? "#f44336" : "#4caf50";

  const batteryBodyStyle = [
    styles.batteryBody,
    { width: width + 6, height, borderRadius: height * 0.25 },
  ];
  const capStyle = [
    styles.batteryCap,
    { height: height * 0.5, marginLeft: width * 0.1 },
  ];

  return (
    <View style={styles.container}>
      <View style={batteryBodyStyle}>
        {[0, 1, 2].map((index) => (
          <View
            key={index}
            style={[
              styles.segment,
              {
                width: (width - 8) / 3,
                backgroundColor: index < segments ? activeColor : "transparent",
                borderColor:
                  index < segments ? activeColor : "rgba(255,255,255,0.25)",
              },
            ]}
          />
        ))}
      </View>

      <View style={capStyle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  batteryBody: {
    borderWidth: 2,
    borderColor: "#fff",
    paddingHorizontal: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  batteryCap: {
    width: 4,
    borderRadius: 2,
    backgroundColor: "#fff",
  },
  segment: {
    height: "70%",
    marginHorizontal: 1,
    borderWidth: 1,
    borderRadius: 2,
  },
});
