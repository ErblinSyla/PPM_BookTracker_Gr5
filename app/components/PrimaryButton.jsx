import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

export default function BackgroundGradient({ children }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAF0DC" }}>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={["#FAF0DC", "#F2EBE2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      >
        {children}
      </LinearGradient>
    </SafeAreaView>
  );
}
