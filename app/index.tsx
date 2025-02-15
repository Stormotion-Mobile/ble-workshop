import { Text, View } from "react-native";
import useAndroidBluetoothPermissions from "@/hooks/useAndroidBluetoothPermissions";

export default function Index() {
  useAndroidBluetoothPermissions();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
