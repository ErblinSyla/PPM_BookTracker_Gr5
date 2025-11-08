"use client";

import { Text, TouchableOpacity, Image, View, Animated } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";

import BackgroundGradient from "./components/BackgroundGradient";
import PrimaryButton from "./components/PrimaryButton";

export const options = { headerShown: false };

export default function Index() {
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const fadeLogo = useRef(new Animated.Value(0)).current;
  const fadeTitle = useRef(new Animated.Value(0)).current;
  const fadeSubtitle = useRef(new Animated.Value(0)).current;
  const fadeQuote = useRef(new Animated.Value(0)).current;
  const floatAnimLogo = useRef(new Animated.Value(0)).current;
  const floatAnimQuote = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

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
        Animated.timing(anim, {
          toValue: -8,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();

    fadeIn(fadeLogo, 0);
    fadeIn(fadeTitle, 300);
    fadeIn(fadeSubtitle, 700);
    fadeIn(fadeQuote, 1000);

    floatAnimLoop(floatAnimLogo);
    floatAnimLoop(floatAnimQuote);
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
    <BackgroundGradient>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 30,
        }}
      >
        <Animated.View
          style={{
            width: "100%",
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            alignItems: "center",
          }}
        >
          <Animated.View
            style={{
              opacity: fadeLogo,
              transform: [{ translateY: floatAnimLogo }],
              marginBottom: 20,
            }}
          >
            <Image
              source={require("../assets/book4.png")}
              resizeMode="contain"
              style={{ width: 140, height: 140 }}
            />
          </Animated.View>

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
            Discover, read, and track your favorite books.
          </Animated.Text>

          <Animated.View
            style={{ transform: [{ scale: buttonScale }], width: "80%" }}
          >
            <PrimaryButton
              title="Get Started"
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={() => router.push("/signup")}
            />
          </Animated.View>

          <TouchableOpacity
            style={{
              padding: 16,
              backgroundColor: "#550000",
              borderRadius: 8,
            }}
            onPress={() => router.push("/signup")}
          >
            <Text style={{ color: "#FAF0DC", fontWeight: "700" }}>
              Join BookTracker
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/login")}
            style={{ marginTop: 18 }}
          >
            <Text style={{ color: "#550000", fontSize: 15 }}>
              Already have an account?{" "}
              <Text style={{ color: "#550000", fontWeight: "600" }}>
                Log in
              </Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.Text
          style={{
            position: "absolute",
            bottom: 30,
            fontSize: 14,
            color: "#550000",
            fontStyle: "italic",
            textAlign: "center",
            opacity: fadeQuote,
            transform: [{ translateY: floatAnimQuote }],
            lineHeight: 22,
            width: "90%",
          }}
        >
          “A reader lives a thousand lives before he dies.” — George R.R. Martin
        </Animated.Text>
      </View>
    </BackgroundGradient>
  );
}
