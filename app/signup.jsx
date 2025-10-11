import { View, Text, Pressable, StyleSheet, StatusBar } from "react-native";

export default function CreateAcc() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5efe6" />

      <Text style={styles.logo}>Create an Account</Text>
      <Text style={styles.subtitle}>
        Join BookTrack and start organizing your reading journey.
      </Text>

      <Pressable style={[styles.button, styles.actionButton]}>
        <Text style={styles.buttonText}>Continue with Email</Text>
      </Pressable>

      <Pressable style={[styles.button, styles.actionButton]}>
        <Text style={styles.buttonText}>Continue with Google</Text>
      </Pressable>

      <Pressable style={[styles.button, styles.actionButton]}>
        <Text style={styles.buttonText}>Continue with Apple</Text>
      </Pressable>

      <Pressable style={[styles.button, styles.actionButton]}>
        <Text style={styles.buttonText}>Continue with SSO</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5efe6", 
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  logo: {
    fontSize: 32,
    fontWeight: "700",
    color: "#2e2c2c",
    marginBottom: 8,
    fontFamily: "serif",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#4f4a45",
    marginBottom: 40,
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 22,
  },
  button: {
    width: "100%",
    borderRadius: 6,
    paddingVertical: 14,
    marginBottom: 14,
    alignItems: "center",
  },
  actionButton: {
    backgroundColor: "#6b5643", 
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
    textAlign: "center",
  },
});
