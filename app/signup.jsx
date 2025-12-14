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
