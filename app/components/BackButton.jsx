import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function BackButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.text}>←</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#550000",
    fontSize: 26,
    fontWeight: "600",
  },
});
