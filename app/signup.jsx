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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function CreateAcc() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  const handleSignUp = async () => {
  // Validimi i inputeve
  if (name.trim() === "" || email.trim() === "" || password.trim() === "") {
    setError("Please fill all fields!");
    return;
  }

  if (password.length < 6) {
    setError("Password must be at least 6 characters!");
    return;
  }

  setError(""); // Pastron errorin nese gjithçka eshte mire

  try {
    const userData = { name, email, password };
    await AsyncStorage.setItem("user", JSON.stringify(userData));
    alert("Account created successfully!");
    router.push("/login");
  } catch (error) {
    console.error("Error saving user:", error);
    setError("Something went wrong while saving!");
  }
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
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#FAF0DC" }}>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={["#FAF0DC", "#F2EBE2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        {/* Butoni i kthimit mbrapa */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Animated.View
          style={{
            width: "100%",
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Text style={styles.title}>Create an Account</Text>
          <Text style={styles.subtitle}>
            Join BookTracker and begin your elegant reading journey.
          </Text>
          
          <TextInput
           style={styles.input}
           placeholder="Full Name"
           placeholderTextColor="#55000080"
           value={name}
           onChangeText={setName}
          />
          <TextInput
           style={styles.input}
           placeholder="Email"
           placeholderTextColor="#55000080"
           value={email}
           onChangeText={setEmail}
           keyboardType="email-address"
           autoCapitalize="none"
          />
         <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#55000080"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
         />

         {error ? <Text style={styles.error}>{error}</Text> : null}

          
          <Pressable style={styles.buttonAlt} onPress={handleSignUp}>
            <Text style={styles.buttonTextAlt}>Continue with Email</Text>
          </Pressable>

          <Pressable style={styles.buttonAlt}>
            <Text style={styles.buttonTextAlt}>Continue with Google</Text>
          </Pressable>
          <Pressable style={styles.buttonAlt}>
            <Text style={styles.buttonTextAlt}>Continue with Apple</Text>
          </Pressable>
          <Pressable style={styles.buttonAlt}>
            <Text style={styles.buttonTextAlt}>Continue with SSO</Text>
          </Pressable>

          <Pressable onPress={() => router.push("/login")}>
            <Text style={styles.loginText}>
              Already have an account?{" "}
              <Text style={styles.loginLink}>Log In</Text>
            </Text>
          </Pressable>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 25,
    zIndex: 10,
  },
  backText: {
    color: "#550000",
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    color: "#550000",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 10,
    letterSpacing: 1,
    textAlign: "center",
    textTransform: "uppercase",
  },
  subtitle: {
    color: "#550000",
    fontSize: 15,
    marginBottom: 40,
    textAlign: "center",
    lineHeight: 22,
    fontStyle: "italic",
  },
  buttonAlt: {
    borderColor: "#55000060",
    borderWidth: 1,
    borderRadius: 25,
    width: "100%",
    paddingVertical: 15,
    marginBottom: 16,
    backgroundColor: "#ffffff20",
  },
  buttonTextAlt: {
    color: "#550000",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  loginText: {
    color: "#550000",
    marginTop: 25,
    fontSize: 14,
    textAlign: "center",
  },
  loginLink: {
    color: "#550000",
    fontWeight: "700",
  },
  input: {
  borderWidth: 1,
  borderColor: "#55000060",
  borderRadius: 25,
  width: "100%",
  paddingVertical: 12,
  paddingHorizontal: 20,
  marginBottom: 16,
  backgroundColor: "#ffffff40",
  color: "#550000",
},
error: {
  color: "red",
  marginBottom: 10,
  textAlign: "center",
  fontWeight: "600",
},

});