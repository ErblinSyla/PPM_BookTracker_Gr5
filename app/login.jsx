import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
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
import { auth } from "../firebase/firebaseConfig";
import styles from "./styles/LoginStyles"; 
import Input from "./components/Input";
import PasswordInput from "./components/PasswordInput";
import Options from "./components/Options";
import LoginButton from "./components/LoginButton";
import SignupRedirect from "./components/SignupRedirect";
import HeaderTitle from "./components/HeaderTitle"; 


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

  const startAnimations = useCallback(() => {
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
  }, [fadeAnim, slideAnim]);

  const loadSavedCredentials = useCallback(async () => {
    try {
      const [savedEmail, savedPassword] = await Promise.all([
        AsyncStorage.getItem("email"),
        AsyncStorage.getItem("password"),
      ]);
      if (savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
        setChecked(true);
      }
    } catch (e) {
      console.log("Error loading saved credentials", e);
    }
  }, []);

  const handleLogin = useCallback(async () => {
    setErrorMessage("");

    if (!email.trim()) return setErrorMessage("Please enter your email.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setErrorMessage("Please enter a valid email.");
    if (!password.trim()) return setErrorMessage("Please enter your password.");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified)
        return setErrorMessage(
          "Please verify your email first. Check your inbox for the verification link."
        );

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
      setErrorMessage("Invalid credentials.");
    }
  }, [email, password, isChecked, router]);

  const memoizedHeader = useMemo(() => <HeaderTitle>Welcome Back</HeaderTitle>, []);
  const memoizedOptions = useMemo(
    () => <Options isChecked={isChecked} setChecked={setChecked} router={router} />,
    [isChecked, router]
  );
  const memoizedLoginButton = useMemo(() => <LoginButton handleLogin={handleLogin} />, [
    handleLogin,
  ]);
  const memoizedSignupRedirect = useMemo(() => <SignupRedirect router={router} />, [router]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
      <LinearGradient colors={["#FAF0DC", "#F2EBE2"]} style={styles.gradient}>
        <Animated.View
          style={[
            styles.formContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {memoizedHeader}

          <Input label="E-mail" value={email} onChangeText={setEmail} placeholder="example@email.com" />
          <PasswordInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          {memoizedOptions}
          {memoizedLoginButton}
          {memoizedSignupRedirect}
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

