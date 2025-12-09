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
      await signInWithEmailAndPassword(auth, email, password);

      if (isChecked) {
        await AsyncStorage.setItem("email", email);
        await AsyncStorage.setItem("password", password);
      } else {
        await AsyncStorage.removeItem("email");
        await AsyncStorage.removeItem("password");
      }

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
        <BackButton router={router} />

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

const BackButton = ({ router }) => (
  <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
    <Text style={styles.backText}>← Back</Text>
  </TouchableOpacity>
);

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF0DC" },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  backButton: { position: "absolute", top: 50, left: 25 },
  backText: { color: "#550000", fontSize: 16 },
  formContainer: {
    width: "85%",
    maxWidth: 360,
    alignSelf: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#550000",
    textAlign: "center",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  subtitle: {
    color: "#550000",
    marginBottom: 30,
    textAlign: "center",
    fontStyle: "italic",
  },
  inputLabel: {
    alignSelf: "flex-start",
    color: "#550000",
    marginBottom: 5,
    fontWeight: "600",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#55000050",
    borderRadius: 12,
    paddingLeft: 14,
    color: "#550000",
    backgroundColor: "#ffffff20",
  },
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#55000050",
    borderRadius: 12,
    backgroundColor: "#ffffff20",
    height: 50,
    paddingHorizontal: 10,
  },
  passwordInput: { flex: 1, color: "#550000" },
  showText: { color: "#550000", fontWeight: "600", fontSize: 14 },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
    fontWeight: "500",
  },
  optionsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: "#550000",
    paddingVertical: 14,
    borderRadius: 25,
    width: "100%",
    shadowColor: "#550000",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 18,
  },
  loginText: {
    textAlign: "center",
    color: "#FAF0DC",
    fontWeight: "700",
    fontSize: 17,
  },
  signupText: {
    color: "#550000",
    textAlign: "center",
    fontSize: 15,
    marginBottom: 25,
  },
});
