"use client"

import { 
  Text,
  TouchableOpacity,
  Image,
  View,
  Animated,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export const options = {
  headerShown: false,
};

export default function Index() {
  const router = useRouter();

  const fadeIn = (anim, delay = 0) => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 900,
      delay,
      useNativeDriver: true,
    }).start();
  };

  const floatAnimLoop = (anim) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: -8, duration: 3000, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 3000, useNativeDriver: true }),
      ])
    ).start();
  };

  const fadeLogo = useRef(new Animated.Value(0)).current;
  const fadeTitle = useRef(new Animated.Value(0)).current;
  const fadeSubtitle = useRef(new Animated.Value(0)).current;
  const fadeQuote = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fadeIn(fadeLogo, 0);
    fadeIn(fadeTitle, 300);
    fadeIn(fadeSubtitle, 700);
    fadeIn(fadeQuote, 1000);
    floatAnimLoop(floatAnim);
  }, []);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAF0DC" }}>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={["#FAF0DC", "#F2EBE2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 30,
        }}
      >
        <Animated.Image
          source={require("../assets/book4.png")}
          resizeMode="contain"
          style={{
            width: 140,
            height: 140,
            opacity: fadeLogo,
            transform: [{ translateY: floatAnim }],
            marginBottom: 20,
          }}
        />
        <Animated.Text
          style={{
            opacity: fadeTitle,
            fontSize: 28,
            fontWeight: "800",
            color: "#550000",
            textAlign: "center",
            marginBottom: 10,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          BookTracker
        </Animated.Text>
        <Animated.Text
          style={{
            opacity: fadeSubtitle,
            fontSize: 16,
            color: "#550000",
            textAlign: "center",
            lineHeight: 24,
            marginBottom: 30,
            fontWeight: "400",
          }}
        >
          Dicover, read, and track your favorite books.
        </Animated.Text>
        <Animated.View style={{ transform: [{ scale: buttonScale }], width: "80%" }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={() => router.push("/signup")}
            style={{
              backgroundColor: "#550000",
              paddingVertical: 16,
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#550000",
              shadowOpacity: 0.35,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Text style={{ color: "#FAF0DC", fontSize: 17, fontWeight: "700" }}>
              Get Started
            </Text>
          </TouchableOpacity>
        </Animated.View>
        <TouchableOpacity onPress={() => router.push("/login")} style={{ marginTop: 18 }}>
          <Text style={{ color: "#550000", fontSize: 15 }}>
            Already have an account?{" "}
            <Text style={{ color: "#550000", fontWeight: "600" }}>Log in</Text>
          </Text>
        </TouchableOpacity>
        <Animated.Text
          style={{
            position: "absolute",
            bottom: 30,
            fontSize: 14,
            color: "#550000",
            fontStyle: "italic",
            textAlign: "center",
            transform: [{ translateY: floatAnim }],
            lineHeight: 22,
            width: "90%",
          }}
        >
          “A reader lives a thousand lives before he dies.” — George R.R. Martin
        </Animated.Text>
      </LinearGradient>
    </SafeAreaView>
  );
}