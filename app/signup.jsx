import { View, Text, Pressable, StyleSheet, StatusBar } from "react-native";
import { useRouter } from "expo-router";

export default function CreateAcc() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d1b2a" />

      <Text style={styles.title}>Create an Account</Text>
      <Text style={styles.subtitle}>
        Join BookTrack and start organizing your reading journey.
      </Text>

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Continue with Email</Text>
      </Pressable>

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Continue with Google</Text>
      </Pressable>

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Continue with Apple</Text>
      </Pressable>

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Continue with SSO</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/login")}>
        <Text style={styles.loginText}>
          Already have an account?{" "}
          <Text style={styles.loginLink}>Log in</Text>
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d1b2a", 
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 10,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  subtitle: {
    color: "#aab4be",
    fontSize: 15,
    marginBottom: 40,
    textAlign: "center",
    lineHeight: 22,
  },
  button: {
    borderColor: "#ffffff",
    borderWidth: 1,
    borderRadius: 30,
    width: "100%",
    paddingVertical: 15,
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  loginText: {
    color: "#aab4be",
    marginTop: 25,
    fontSize: 14,
  },
  loginLink: {
    color: "#ffb300", 
    fontWeight: "700",
  },
});
