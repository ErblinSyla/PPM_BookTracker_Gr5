import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  StatusBar,
} from "react-native";
import Checkbox from "expo-checkbox";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();
  const [isChecked, setChecked] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

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

  return (
    <View style={{ flex: 1, backgroundColor: "#FAF0DC" }}>
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
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ position: "absolute", top: 50, left: 25 }}
        >
          <Text style={{ color: "#550000", fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>

        <Animated.View
          style={{
            width: "100%",
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
            Welcome Back
          </Text>

          <Text
            style={{
              color: "#550000",
              marginBottom: 30,
              textAlign: "center",
              fontStyle: "italic",
            }}
          >
            Log in to continue your reading journey
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
              marginBottom: 15,
              color: "#550000",
              backgroundColor: "#ffffff20",
            }}
          />

          <Text
            style={{
              alignSelf: "flex-start",
              color: "#550000",
              marginBottom: 5,
              fontWeight: "600",
            }}
          >
            Password
          </Text>
          <TextInput
            placeholder="Your Password"
            placeholderTextColor="#55000070"
            secureTextEntry
            style={{
              width: "100%",
              height: 50,
              borderWidth: 1,
              borderColor: "#55000050",
              borderRadius: 12,
              paddingLeft: 14,
              marginBottom: 15,
              color: "#550000",
              backgroundColor: "#ffffff20",
            }}
          />

          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 25,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Checkbox
                value={isChecked}
                onValueChange={setChecked}
                color={isChecked ? "#550000" : undefined}
              />
              <Text style={{ marginLeft: 8, color: "#550000" }}>
                Remember me
              </Text>
            </View>

            <TouchableOpacity>
              <Text style={{ color: "#550000", fontWeight: "500" }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/homepage")}
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
          >
            <Text
              style={{
                textAlign: "center",
                color: "#FAF0DC",
                fontWeight: "700",
                fontSize: 17,
              }}
            >
              Log In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text
              style={{
                color: "#550000",
                textAlign: "center",
                fontSize: 15,
                marginBottom: 25,
              }}
            >
              Don’t have an account?{" "}
              <Text style={{ fontWeight: "700", color: "#550000" }}>
                Sign Up
              </Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/addNewBook")}
            style={{
              borderColor: "#550000",
              borderWidth: 1.2,
              borderRadius: 25,
              paddingVertical: 14,
              alignItems: "center",
              backgroundColor: "#ffffff20",
              shadowColor: "#550000",
              shadowOpacity: 0.3,
              shadowRadius: 6,
              elevation: 5,
            }}
          >
            <Text
              style={{
                color: "#550000",
                fontWeight: "700",
                fontSize: 16,
              }}
            >
              Add New Book
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}
