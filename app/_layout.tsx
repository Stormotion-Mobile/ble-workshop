import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaperProvider, MD3LightTheme } from "react-native-paper";

export default function RootLayout() {
  const theme = MD3LightTheme;

  const backgroundStyle = useMemo(
    () => ({
      backgroundColor: theme.colors.elevation.level1,
      ...styles.container,
    }),
    [theme.colors.background],
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
