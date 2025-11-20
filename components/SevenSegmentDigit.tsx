import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";

type SegmentKey = "a" | "b" | "c" | "d" | "e" | "f" | "g";

type SevenSegmentDigitProps = {
  value: number | string; // 0-9 or ' '
  width?: number;
  height?: number;
  segmentOnColor?: string;
  segmentOffColor?: string;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
};

const DIGIT_MAP: Record<string, SegmentKey[]> = {
  "0": ["a", "b", "c", "d", "e", "f"],
  "1": ["b", "c"],
  "2": ["a", "b", "d", "e", "g"],
  "3": ["a", "b", "c", "d", "g"],
  "4": ["b", "c", "f", "g"],
  "5": ["a", "c", "d", "f", "g"],
  "6": ["a", "c", "d", "e", "f", "g"],
  "7": ["a", "b", "c"],
  "8": ["a", "b", "c", "d", "e", "f", "g"],
  "9": ["a", "b", "c", "d", "f", "g"],
  " ": [], // blank
};

function getSegmentsForValue(
  value: number | string,
): Record<SegmentKey, boolean> {
  const key = String(value).trim();
  const activeList = DIGIT_MAP[key] ?? [];
  const result: Record<SegmentKey, boolean> = {
    a: false,
    b: false,
    c: false,
    d: false,
    e: false,
    f: false,
    g: false,
  };
  activeList.forEach((seg) => {
    result[seg] = true;
  });
  return result;
}

export const SevenSegmentDigit: React.FC<SevenSegmentDigitProps> = ({
  value,
  width = 60,
  height = 120,
  segmentOnColor = "#FF3B30",
  segmentOffColor = "#330000",
  backgroundColor = "transparent",
  style,
}) => {
  const segments = getSegmentsForValue(value);

  // Thickness of segment relative to digit size
  const thickness = Math.min(width, height) * 0.18;
  const padding = thickness / 2 + 6;

  const horizontalLength = width - 2 * padding;
  const verticalLength = (height - 3 * thickness) / 2;

  const baseSegmentStyle: ViewStyle = {
    position: "absolute",
    borderRadius: thickness / 2,
  };

  const colorFor = (key: SegmentKey) =>
    segments[key] ? segmentOnColor : segmentOffColor;

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
          backgroundColor,
        },
        style,
      ]}
    >
      {/* a - top */}
      <View
        style={[
          baseSegmentStyle,
          {
            top: 0,
            left: padding,
            width: horizontalLength,
            height: thickness,
            backgroundColor: colorFor("a"),
          },
        ]}
      />

      {/* d - bottom */}
      <View
        style={[
          baseSegmentStyle,
          {
            bottom: 0,
            left: padding,
            width: horizontalLength,
            height: thickness,
            backgroundColor: colorFor("d"),
          },
        ]}
      />

      {/* g - middle */}
      <View
        style={[
          baseSegmentStyle,
          {
            top: (height - thickness) / 2,
            left: padding,
            width: horizontalLength,
            height: thickness,
            backgroundColor: colorFor("g"),
          },
        ]}
      />

      {/* b - top right */}
      <View
        style={[
          baseSegmentStyle,
          {
            top: padding,
            right: 0,
            width: thickness,
            height: verticalLength,
            backgroundColor: colorFor("b"),
          },
        ]}
      />

      {/* c - bottom right */}
      <View
        style={[
          baseSegmentStyle,
          {
            bottom: padding,
            right: 0,
            width: thickness,
            height: verticalLength,
            backgroundColor: colorFor("c"),
          },
        ]}
      />

      {/* f - top left */}
      <View
        style={[
          baseSegmentStyle,
          {
            top: padding,
            left: 0,
            width: thickness,
            height: verticalLength,
            backgroundColor: colorFor("f"),
          },
        ]}
      />

      {/* e - bottom left */}
      <View
        style={[
          baseSegmentStyle,
          {
            bottom: padding,
            left: 0,
            width: thickness,
            height: verticalLength,
            backgroundColor: colorFor("e"),
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
  },
});
