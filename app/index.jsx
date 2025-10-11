import { Text, TouchableOpacity, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export const options = {
  headerShown: false,
};

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#522987", "#4e56c0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 30,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#FFDD59",
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          Welcome to BookTracker
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: "#E0E0E0",
            textAlign: "center",
            marginBottom: 30,
            fontStyle: "italic",
          }}
        >
          Discover, read, and track your favorite books
        </Text>

        <TouchableOpacity
          style={{
            backgroundColor: "#FFDD59",
            paddingVertical: 12,
            paddingHorizontal: 25,
            borderRadius: 30,
            marginBottom: 15,
            width: "80%",
          }}
          onPress={() => router.push("/signup")}
        >
          <Text
            style={{
              color: "#522987",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Join BookTracker
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ padding: 10 }}
          onPress={() => router.push("/login")}
        >
          <Text
            style={{
              textAlign: "center",
              fontStyle: "italic",
              color: "#E0E0E0",
            }}
          >
            Already have an account? Log in.
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
}
