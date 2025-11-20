import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { SevenSegmentDigit } from "./SevenSegmentDigit";

type SevenSegmentDisplayProps = {
  value: number | string;
  digitWidth?: number;
  digitHeight?: number;
  spacing?: number;
  segmentOnColor?: string;
  segmentOffColor?: string;
  backgroundColor?: string;
  dotOnColor?: string;
  dotOffColor?: string;
  hideDisabledDots?: boolean;
  style?: StyleProp<ViewStyle>;
};

type DigitWithDot = {
  char: string;
  hasDot: boolean;
};

function parseValue(v: number | string): DigitWithDot[] {
  const input = String(v);
  const s = input.replace(/[^0-9.]/g, "");
  const result: DigitWithDot[] = [];

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];

    if (ch === ".") {
      if (result.length > 0) {
        result[result.length - 1].hasDot = true;
      } else {
        result.push({ char: " ", hasDot: true });
      }
    } else {
      result.push({ char: ch, hasDot: false });
    }
  }

  return result;
}

export const SevenSegmentDisplay: React.FC<SevenSegmentDisplayProps> = ({
  value,
  digitWidth = 40,
  digitHeight = 80,
  spacing = 12,
  segmentOnColor = "#FF3B30",
  segmentOffColor = "#9b9b99",
  backgroundColor = "transparent",
  dotOnColor,
  dotOffColor,
  hideDisabledDots = true,
  style,
}) => {
  const digits = parseValue(value);

  const dotSize = Math.min(digitWidth, digitHeight) * 0.18;
  const dotActiveColor = dotOnColor ?? segmentOnColor;
  const dotInactiveColor = dotOffColor ?? segmentOffColor;

  return (
    <View style={[styles.row, style]}>
      {digits.map((d, index) => (
        <View
          key={`${d.char}-${index}`}
          style={[
            styles.digitWrapper,
            {
              width: digitWidth,
              height: digitHeight,
              marginRight: index === digits.length - 1 ? 0 : spacing,
            },
          ]}
        >
          <SevenSegmentDigit
            value={d.char}
            width={digitWidth}
            height={digitHeight}
            segmentOnColor={segmentOnColor}
            segmentOffColor={segmentOffColor}
            backgroundColor={backgroundColor}
          />

          <View
            style={[
              styles.dot,
              {
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
                backgroundColor: d.hasDot ? dotActiveColor : dotInactiveColor,
                right: -spacing / 2,
                bottom: 0,
                opacity: d.hasDot ? 1 : hideDisabledDots ? 0 : 0.3,
              },
            ]}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  digitWrapper: {
    position: "relative",
  },
  dot: {
    position: "absolute",
  },
});
