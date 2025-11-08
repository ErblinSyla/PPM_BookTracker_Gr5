import { View, Text, TextInput } from "react-native";
import { StyleSheet } from "react-native";

export default function NotesField({ notes, setNotes }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>Personal Notes</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={notes}
        onChangeText={setNotes}
        placeholder="Favorite quotes, thoughts, ideas..."
        multiline
        numberOfLines={5}
        textAlignVertical="top"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 24 },
  label: {
    color: "#550000",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#55000050",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#ffffff30",
    color: "#550000",
    fontSize: 15,
  },
  textArea: { height: 100, paddingTop: 14 },
});
