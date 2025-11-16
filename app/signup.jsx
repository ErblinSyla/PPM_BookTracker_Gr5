import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Platform
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import { registerUserWithEmail, signInWithGoogle, signInWithApple } from "./services/authService";
import { GoogleAuthProvider } from "firebase/auth";

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  // Google Auth
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "<YOUR_EXPO_CLIENT_ID>",
    iosClientId: "<YOUR_IOS_CLIENT_ID>",
    androidClientId: "<YOUR_ANDROID_CLIENT_ID>",
    webClientId: "<YOUR_WEB_CLIENT_ID>",
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSignUpEmail = async () => {
    if (name.trim() === "" || email.trim() === "" || password.trim() === "") {
      setError("Please fill all fields!");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters!");
      return;
    }
    setError("");

    try {
      const user = await registerUserWithEmail(email, password, name);
      await AsyncStorage.setItem("userUID", user.uid);
      alert("Account created successfully!");
      router.push("/login");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") setError("Email is already in use!");
      else if (err.code === "auth/invalid-email") setError("Invalid email address!");
      else if (err.code === "auth/weak-password") setError("Password is too weak!");
      else setError("Something went wrong! Try again.");
      console.error(err);
    }
  };

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithGoogle(credential)
        .then(user => {
          AsyncStorage.setItem("userUID", user.uid);
          router.push("/home");
        })
        .catch(() => setError("Google Sign-In failed!"));
    }
  }, [response]);

  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const fullName = credential.fullName?.givenName || "Apple User";
      const user = await signInWithApple(credential.identityToken, fullName);
      await AsyncStorage.setItem("userUID", user.uid);
      router.push("/home");
    } catch (err) {
      setError("Apple Sign-In failed!");
      console.error(err);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FAF0DC" }}>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
      <LinearGradient colors={["#FAF0DC", "#F2EBE2"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.gradient}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Animated.View style={{ width: "100%", opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.title}>Create an Account</Text>
          <Text style={styles.subtitle}>Join BookTracker and begin your elegant reading journey.</Text>

          <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#55000080" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#55000080" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#55000080" secureTextEntry value={password} onChangeText={setPassword} autoCapitalize="none" />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable style={styles.buttonAlt} onPress={handleSignUpEmail}>
            <Text style={styles.buttonTextAlt}>Continue with Email</Text>
          </Pressable>

          <Pressable style={styles.buttonAlt} onPress={() => promptAsync()}>
            <Text style={styles.buttonTextAlt}>Continue with Google</Text>
          </Pressable>

          {Platform.OS === "ios" && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={25}
              style={{ width: '100%', height: 50, marginBottom: 16 }}
              onPress={handleAppleSignIn}
            />
          )}

          <Pressable onPress={() => router.push("/login")}>
            <Text style={styles.loginText}>Already have an account? <Text style={styles.loginLink}>Log In</Text></Text>
          </Pressable>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 30 },
  backButton: { position: "absolute", top: 50, left: 25, zIndex: 10 },
  backText: { color: "#550000", fontSize: 16, fontWeight: "600" },
  title: { color: "#550000", fontSize: 30, fontWeight: "800", marginBottom: 10, letterSpacing: 1, textAlign: "center", textTransform: "uppercase" },
  subtitle: { color: "#550000", fontSize: 15, marginBottom: 40, textAlign: "center", lineHeight: 22, fontStyle: "italic" },
  buttonAlt: { borderColor: "#55000060", borderWidth: 1, borderRadius: 25, width: "100%", paddingVertical: 15, marginBottom: 16, backgroundColor: "#ffffff20" },
  buttonTextAlt: { color: "#550000", textAlign: "center", fontSize: 16, fontWeight: "600" },
  loginText: { color: "#550000", marginTop: 25, fontSize: 14, textAlign: "center" },
  loginLink: { color: "#550000", fontWeight: "700" },
  input: { borderWidth: 1, borderColor: "#55000060", borderRadius: 25, width: "100%", paddingVertical: 12, paddingHorizontal: 20, marginBottom: 16, backgroundColor: "#ffffff40", color: "#550000" },
  error: { color: "red", marginBottom: 10, textAlign: "center", fontWeight: "600" },
});