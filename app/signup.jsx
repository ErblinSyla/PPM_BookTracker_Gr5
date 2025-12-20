import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function SignupOptions() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
      <Text style={styles.subtitle}>Choose a method to continue</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/SignupEmail")}>
        <Text style={styles.buttonText}>Continue with Email</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/GitHubLogin")}>
        <Text style={styles.buttonText}>Continue with GitHub</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.loginText}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FAF0DC", padding: 30 },
  title: { fontSize: 28, fontWeight: "700", color: "#550000", marginBottom: 8 },
  subtitle: { fontSize: 15, color: "#550000", marginBottom: 40 },
  button: { backgroundColor: "#ffffff40", borderWidth: 1, borderColor: "#55000070", borderRadius: 25, paddingVertical: 15, width: "100%", marginBottom: 16 },
  buttonText: { textAlign: "center", color: "#550000", fontWeight: "600", fontSize: 16 },
  loginText: { marginTop: 20, color: "#550000" },
}); 