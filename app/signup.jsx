import { View, Text, StyleSheet } from "react-native";

export default function CreateAcc() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
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
});
