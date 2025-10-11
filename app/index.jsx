import {
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  View,
} from "react-native";
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
        <View
          style={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: "#ffffff20",
            top: 100,
            left: -50,
          }}
        />
        <View
          style={{
            position: "absolute",
            width: 250,
            height: 250,
            borderRadius: 125,
            backgroundColor: "#ffffff10",
            bottom: 50,
            right: -80,
          }}
        />
        <Image
          source={require("../assets/book.png")}
          style={{ width: 60, height: 60, marginBottom: 20 }}
          resizeMode="contain"
        />

        <Text
          style={{
            fontSize: 21,
            fontWeight: "900",
            letterSpacing: 1.2,
            textTransform: "uppercase",
            color: "#FFDD59",
            marginBottom: 12,
          }}
        >
          Welcome to BookTracker
        </Text>

        <Text
          style={{
            fontSize: 18,
            color: "#FFFFFFCC",
            textAlign: "center",
            fontStyle: "italic",
            lineHeight: 24,
          }}
        >
          Discover, read, and track your favorite books.
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#FFDD59",
            paddingVertical: 14,
            borderRadius: 30,
            width: "80%",
            maxWidth: 300,
            shadowColor: "#000",
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 6,
            marginTop: 20,
          }}
          onPress={() => router.push("/signup")}
        >
          <Text
            style={{
              color: "#522987",
              fontWeight: "bold",
              fontSize: 16,
              textAlign: "center",
            }}
          >
            Get Started
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
        <TouchableOpacity style={{ padding: 10 }}>
          <Text
            style={{
              color: "#FFFFFFB0",
              fontSize: 14,
              marginTop: 40,
              fontStyle: "italic",
            }}
          >
            “A reader lives a thousand lives before he dies.” — George R.R.
            Martin
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
}
