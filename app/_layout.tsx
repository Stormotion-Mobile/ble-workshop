import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaperProvider, MD3DarkTheme } from "react-native-paper";

export default function RootLayout() {
  const theme = MD3DarkTheme;

  const backgroundStyle = useMemo(
    () => ({
      backgroundColor: theme.colors.elevation.level1,
      ...styles.container,
    }),
    [theme.colors.elevation.level1],
  );

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={backgroundStyle}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
