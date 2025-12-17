import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  StatusBar,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, Stack } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export default function ForgotPassword() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

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
  }, []);

  const handleResetPassword = async () => {
    setError("");

    if (!email.trim()) {
      setError("Please enter your email!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email!");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Check your email",
        "A password reset link has been sent to your email."
      );
      setEmail(""); // pastro email pas suksesit
      router.replace("/login");
    } catch (err) {
      console.log("Firebase error:", err);
      if (err.code === "auth/user-not-found") setError("If this email exists, you will receive a reset link.");
      else if (err.code === "auth/invalid-email") setError("Invalid email address!");
      else setError("Something went wrong. Please try again!");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FAF0DC" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" backgroundColor="transparent" translucent />

      <LinearGradient
        colors={["#FAF0DC", "#F2EBE2"]}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 30,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ position: "absolute", top: 50, left: 25 }}
        >
          <Text style={{ color: "#550000", fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>

        <Animated.View
          style={{
            width: "85%",
            maxWidth: 360,
            alignSelf: "center",
            alignItems: "center",
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Text
            style={{
              fontSize: 30,
              fontWeight: "800",
              color: "#550000",
              textAlign: "center",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Forgot Password
          </Text>

          <Text
            style={{
              color: "#550000",
              marginBottom: 30,
              textAlign: "center",
              fontStyle: "italic",
            }}
          >
            Enter your email to reset your password
          </Text>

          <Text
            style={{
              alignSelf: "flex-start",
              color: "#550000",
              marginBottom: 5,
              fontWeight: "600",
            }}
          >
            E-mail
          </Text>

          <TextInput
            placeholder="example@email.com"
            placeholderTextColor="#55000070"
            style={{
              width: "100%",
              height: 50,
              borderWidth: 1,
              borderColor: "#55000050",
              borderRadius: 12,
              paddingLeft: 14,
              marginBottom: 8,
              color: "#550000",
              backgroundColor: "#ffffff20",
            }}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {error ? (
            <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
          ) : null}

          <TouchableOpacity
            style={{
              backgroundColor: "#550000",
              paddingVertical: 14,
              borderRadius: 25,
              width: "100%",
              shadowColor: "#550000",
              shadowOpacity: 0.4,
              shadowRadius: 8,
              elevation: 8,
              marginBottom: 18,
            }}
            onPress={handleResetPassword}
          >
            <Text
              style={{
                textAlign: "center",
                color: "#FAF0DC",
                fontWeight: "700",
                fontSize: 17,
              }}
            >
              Send Reset Email
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text
              style={{
                color: "#550000",
                textAlign: "center",
                fontSize: 15,
                marginBottom: 25,
              }}
            >
              Remembered your password?{" "}
              <Text style={{ fontWeight: "700", color: "#550000" }}>Log In</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}
