import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  StatusBar,
  Alert,
} from "react-native";
import Checkbox from "expo-checkbox";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function Login() {
  const router = useRouter();
  const [isChecked, setChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

    const loadData = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem("email");
        const savedPassword = await AsyncStorage.getItem("password");
        if (savedEmail && savedPassword) {
          setEmail(savedEmail);
          setPassword(savedPassword);
          setChecked(true);
        }
      } catch (e) {
        console.log("Error loading saved credentials", e);
      }
    };
    loadData();
  }, []);

  const handleLogin = async () => {
    setErrorMessage("");

    if (email.trim() === "") {
      setErrorMessage("Please enter your email.");
      return;
    }

    if (password.trim() === "") {
      setErrorMessage("Please enter your password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (isChecked) {
        await AsyncStorage.setItem("email", email);
        await AsyncStorage.setItem("password", password);
      } else {
        await AsyncStorage.removeItem("email");
        await AsyncStorage.removeItem("password");
      }

      await AsyncStorage.setItem("userUID", user.uid);
      Alert.alert("Success", "You have logged in successfully!");
      router.push("/homepage");
    } catch (error) {
      console.log("Firebase login error:", error);

      if (error.code === "auth/user-not-found") {
        setErrorMessage("This user does not exist. Please sign up first!");
      } else if (error.code === "auth/wrong-password") {
        setErrorMessage("Incorrect password. Please try again!");
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("Invalid email format!");
      } else {
        setErrorMessage("Something went wrong. Please try again!");
      }
    }
  };

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
            value={email}
            onChangeText={setEmail}
            placeholder="example@email.com"
            placeholderTextColor="#55000070"
            style={{
              width: "100%",
              height: 50,
              borderWidth: 1,
              borderColor: "#55000050",
              borderRadius: 12,
              paddingLeft: 14,
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
              marginTop: 15,
            }}
          >
            Password
          </Text>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#55000050",
              borderRadius: 12,
              backgroundColor: "#ffffff20",
              height: 50,
              paddingHorizontal: 10,
            }}
          >
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Your Password"
              placeholderTextColor="#55000070"
              secureTextEntry={!showPassword}
              style={{
                flex: 1,
                color: "#550000",
              }}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text
                style={{
                  color: "#550000",
                  fontWeight: "600",
                  fontSize: 14,
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>

          {errorMessage ? (
            <Text
              style={{
                color: "red",
                textAlign: "center",
                marginTop: 10,
                marginBottom: 10,
                fontWeight: "500",
              }}
            >
              {errorMessage}
            </Text>
          ) : null}

          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 25,
              marginTop: 10,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Checkbox
                value={isChecked}
                onValueChange={setChecked}
                color={isChecked ? "#550000" : undefined}
              />
              <Text style={{ marginLeft: 8, color: "#550000" }}>Remember me</Text>
            </View>

            <TouchableOpacity onPress={() => router.push("/ForgotPassword")}>
              <Text style={{ color: "#550000", fontWeight: "500" }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleLogin}
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
        </Animated.View>
      </LinearGradient>
    </View>
  );
}
