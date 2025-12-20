import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function PrimaryButton({ title, onPress, style, testID }) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      testID={testID}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#550000",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },
  text: {
    color: "#FAF0DC",
    fontSize: 16,
    fontWeight: "700",
  },
});
