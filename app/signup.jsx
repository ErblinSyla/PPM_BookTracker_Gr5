import { View, Text, Pressable, StyleSheet, StatusBar } from "react-native";

export default function CreateAcc() {
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d1b2a", // navy blue
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
});