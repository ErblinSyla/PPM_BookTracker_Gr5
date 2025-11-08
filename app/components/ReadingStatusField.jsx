import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { StyleSheet } from "react-native";

export default function ReadingStatusField({ status, onStatusChange }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>Reading Status</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={status}
          onValueChange={onStatusChange}
          style={styles.picker}
          dropdownIconColor="#550000"
        >
          <Picker.Item label="To Read" value="to-read" />
          <Picker.Item label="Currently Reading" value="reading" />
          <Picker.Item label="Finished" value="finished" />
        </Picker>
      </View>
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#55000050",
    borderRadius: 12,
    backgroundColor: "#ffffff30",
    overflow: "hidden",
  },
  picker: { color: "#550000", padding: 3 },
});
