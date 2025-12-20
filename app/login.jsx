import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  StatusBar,
  Alert,
  StyleSheet,
} from "react-native";
import Checkbox from "expo-checkbox";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import styles from "./styles/LoginStyles"; 

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    startAnimations();
    loadSavedCredentials();
  }, []);

  const startAnimations = () => {
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
  };

  const loadSavedCredentials = async () => {
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

  const handleLogin = async () => {
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter your email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email.");
      return;
    }

    if (!password.trim()) {
      setErrorMessage("Please enter your password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Kontrollo nëse emaili është verifikuar
      if (!user.emailVerified) {
        setErrorMessage(
          "Please verify your email first. Check your inbox for the verification link."
        );
        return;
      }

      // Ruaj credentials në AsyncStorage nëse është checked
      if (isChecked) {
        await AsyncStorage.setItem("email", email);
        await AsyncStorage.setItem("password", password);
      } else {
        await AsyncStorage.removeItem("email");
        await AsyncStorage.removeItem("password");
      }

      // Ruaj UID për përdorim tek Profile.jsx
      await AsyncStorage.setItem("userUID", user.uid);

      Alert.alert("Success", "You have logged in successfully!");
      router.push("/homepage");
    } catch (error) {
      console.log("Firebase login error:", error);
      setErrorMessage("Invalid credentials.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
      <LinearGradient colors={["#FAF0DC", "#F2EBE2"]} style={styles.gradient}>
        {/* HIQUR KREJT BackButton – nuk ka më buton back */}

        <Animated.View
          style={[
            styles.formContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Header />
          <Input
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="example@email.com"
          />
          <PasswordInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          <Options
            isChecked={isChecked}
            setChecked={setChecked}
            router={router}
          />

          <LoginButton handleLogin={handleLogin} />
          <SignupRedirect router={router} />
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const Header = () => (
  <>
    <Text style={styles.title}>Welcome Back</Text>
    <Text style={styles.subtitle}>Log in to continue your reading journey</Text>
  </>
);

const Input = ({ label, value, onChangeText, placeholder }) => (
  <>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#55000070"
      style={styles.input}
    />
  </>
);

const PasswordInput = ({
  label,
  value,
  onChangeText,
  showPassword,
  setShowPassword,
}) => (
  <>
    <Text style={[styles.inputLabel, { marginTop: 15 }]}>{label}</Text>
    <View style={styles.passwordContainer}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Your Password"
        placeholderTextColor="#55000070"
        secureTextEntry={!showPassword}
        style={styles.passwordInput}
      />
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Text style={styles.showText}>{showPassword ? "Hide" : "Show"}</Text>
      </TouchableOpacity>
    </View>
  </>
);

const Options = ({ isChecked, setChecked, router }) => (
  <View style={styles.optionsContainer}>
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
);

const LoginButton = ({ handleLogin }) => (
  <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
    <Text style={styles.loginText}>Log In</Text>
  </TouchableOpacity>
);

const SignupRedirect = ({ router }) => (
  <TouchableOpacity onPress={() => router.push("/signup")}>
    <Text style={styles.signupText}>
      Don’t have an account? <Text style={{ fontWeight: "700" }}>Sign Up</Text>
    </Text>
  </TouchableOpacity>
);
