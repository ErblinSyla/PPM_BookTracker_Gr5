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
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden />
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
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            position: "absolute",
            top: 50,
            left: 20,
          }}
        >
          <Text style={{ color: "#FFDD59", fontSize: 16 }}>← Back</Text>
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
              fontSize: 28,
              fontWeight: "700",
              color: "#FFDD59",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Login to your{"\n"}account
          </Text>
          <Text
            style={{
              color: "#FFFFFFCC",
              marginBottom: 25,
              textAlign: "center",
              fontStyle: "italic",
            }}
          >
            Hello, welcome back to your account
          </Text>
          <Text
            style={{
              alignSelf: "flex-start",
              color: "#FFDD59",
              marginBottom: 5,
            }}
          >
            E-mail
          </Text>
          <TextInput
            placeholder="example@email.com"
            placeholderTextColor="#ddd"
            style={{
              width: "100%",
              height: 50,
              borderWidth: 1,
              borderColor: "#ffffff40",
              borderRadius: 10,
              paddingLeft: 12,
              marginBottom: 15,
              color: "#fff",
              backgroundColor: "#ffffff15",
            }}
          />
          <Text
            style={{
              alignSelf: "flex-start",
              color: "#FFDD59",
              marginBottom: 5,
            }}
          >
            Password
          </Text>
          <TextInput
            placeholder="Your Password"
            placeholderTextColor="#ddd"
            secureTextEntry
            style={{
              width: "100%",
              height: 50,
              borderWidth: 1,
              borderColor: "#ffffff40",
              borderRadius: 10,
              paddingLeft: 12,
              marginBottom: 10,
              color: "#fff",
              backgroundColor: "#ffffff15",
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
                color={isChecked ? "#FFDD59" : undefined}
              />
              <Text style={{ marginLeft: 8, color: "#FFFFFFB0" }}>
                Remember me
              </Text>
            </View>
            <TouchableOpacity>
              <Text style={{ color: "#FFDD59", fontWeight: "500" }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/home")}
            style={{
              backgroundColor: "#FFDD59",
              paddingVertical: 14,
              borderRadius: 10,
              width: "100%",
              marginBottom: 15,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 6,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "#522987",
                fontWeight: "700",
                fontSize: 16,
              }}
            >
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text
              style={{
                color: "#FFFFFFCC",
                textAlign: "center",
                marginBottom: 15,
              }}
            >
              Don’t have an account?{" "}
              <Text style={{ fontWeight: "700", color: "#FFDD59" }}>
                Sign Up
              </Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/addNewBook")}
            style={{
              backgroundColor: "#FFDD59",
              paddingVertical: 14,
              borderRadius: 10,
              width: "100%",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "#522987",
                fontWeight: "700",
                fontSize: 16,
              }}
            >
              Go to Book List
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}
