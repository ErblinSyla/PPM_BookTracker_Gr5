import React, { useEffect, useCallback, memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

// Importet e Firebase
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

function SignupOptions() {
  const router = useRouter();

  // Kontrollo nëse përdoruesi është i loguar
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/homepage");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Memoizo funksionet e navigimit
  const handleEmailSignup = useCallback(() => {
    router.push("/SignupEmail");
  }, [router]);

  const handleGitHubSignup = useCallback(() => {
    router.push("/GitHubLogin");
  }, [router]);

  const handleLogin = useCallback(() => {
    router.push("/login");
  }, [router]);

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Create an Account</Text>
        <Text style={styles.subtitle}>Choose a method to continue</Text>

        <TouchableOpacity style={styles.button} onPress={handleEmailSignup}>
          <Text style={styles.buttonText}>Continue with Email</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleGitHubSignup}>
          <Text style={styles.buttonText}>Continue with GitHub</Text>
        </TouchableOpacity>

        <View style={styles.footerTextContainer}>
          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text style={styles.boldText} onPress={handleLogin}>
              Log in
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF0DC",
    justifyContent: "center",
    alignItems: "center",
  },
  contentWrapper: {
    width: "100%",
    maxWidth: 440,
    paddingHorizontal: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#550000",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#550000",
    marginBottom: 40,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#ffffff40",
    borderWidth: 1,
    borderColor: "#55000070",
    borderRadius: 25,
    paddingVertical: 16,
    width: "100%",
    marginBottom: 16,
  },
  buttonText: {
    textAlign: "center",
    color: "#550000",
    fontWeight: "600",
    fontSize: 16,
  },
  footerTextContainer: {
    marginTop: 32,
  },
  footerText: {
    fontSize: 15,
    color: "#550000",
    textAlign: "center",
  },
  boldText: {
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});

// Memoizo komponentin për të shmangur re-render të panevojshëm
export default memo(SignupOptions);