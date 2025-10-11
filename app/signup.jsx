import { View, Text, Pressable, StyleSheet } from "react-native";

export default function CreateAcc() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>

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
    backgroundColor: "#1a237e",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
  },
  button: {
    width: "100%",
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 25,
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
});
