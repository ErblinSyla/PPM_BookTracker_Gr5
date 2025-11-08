import { View, Text, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StyleSheet } from "react-native";

export default function FinishDateField({
  finishDate,
  setFinishDate,
  showDatePicker,
  setShowDatePicker,
}) {
  const formatDate = (date) => {
    if (!date) return "Select date";
    return date.toLocaleDateString("sq-AL");
  };

  return (
    <View style={styles.field}>
      <Text style={styles.label}>Expected Finish Date</Text>

      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateText}>{formatDate(finishDate)}</Text>
      </TouchableOpacity>

      {Platform.OS !== "web" && showDatePicker && (
        <DateTimePicker
          value={finishDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setFinishDate(selectedDate);
          }}
        />
      )}

      {Platform.OS === "web" && showDatePicker && (
        <input
          type="date"
          style={{
            marginTop: 8,
            padding: 12,
            borderRadius: 12,
            border: "1px solid #55000050",
            backgroundColor: "#ffffff30",
            color: "#550000",
            fontSize: 15,
            textAlign: "center",
            width: "95%",
          }}
          value={finishDate ? finishDate.toISOString().split("T")[0] : ""}
          onChange={(e) => {
            const date = e.target.value ? new Date(e.target.value) : null;
            setFinishDate(date);
            setShowDatePicker(false);
          }}
        />
      )}
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
  dateButton: {
    borderWidth: 1,
    borderColor: "#55000050",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#ffffff30",
  },
  dateText: {
    color: "#550000",
    textAlign: "center",
    fontWeight: "600",
  },
});
