import { View, Text, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StyleSheet } from "react-native";

export default function SessionTimeField({
  sessionStartTime,
  setSessionStartTime,
  sessionEndTime,
  setSessionEndTime,
  showStartTimePicker,
  setShowStartTimePicker,
  showEndTimePicker,
  setShowEndTimePicker,
}) {
  const formatTime = (time) => {
    if (!time) return "Select time";
    return time.toLocaleTimeString("sq-AL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStartTimeChange = (event, selectedTime) => {
    setShowStartTimePicker(false);
    if (selectedTime) setSessionStartTime(selectedTime);
  };

  const handleEndTimeChange = (event, selectedTime) => {
    setShowEndTimePicker(false);
    if (selectedTime) setSessionEndTime(selectedTime);
  };

  return (
    <View style={styles.field}>
      <Text style={styles.label}>Reading Session (Optional)</Text>

      <View style={styles.timeRow}>
        <View style={styles.timeColumn}>
          <Text style={styles.timeLabel}>Start Time</Text>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowStartTimePicker(true)}
          >
            <Text style={styles.timeText}>{formatTime(sessionStartTime)}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timeColumn}>
          <Text style={styles.timeLabel}>End Time</Text>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowEndTimePicker(true)}
          >
            <Text style={styles.timeText}>{formatTime(sessionEndTime)}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {Platform.OS !== "web" && showStartTimePicker && (
        <DateTimePicker
          value={sessionStartTime || new Date()}
          mode="time"
          display="default"
          onChange={handleStartTimeChange}
        />
      )}

      {Platform.OS !== "web" && showEndTimePicker && (
        <DateTimePicker
          value={sessionEndTime || new Date()}
          mode="time"
          display="default"
          onChange={handleEndTimeChange}
        />
      )}

      {Platform.OS === "web" && showStartTimePicker && (
        <input
          type="time"
          style={styles.webInput}
          defaultValue={sessionStartTime ? sessionStartTime.toLocaleTimeString("sq-AL", { hour: "2-digit", minute: "2-digit" }).replace(" ", "") : ""}
          onChange={(e) => {
            const [hours, minutes] = e.target.value.split(":");
            const newTime = new Date();
            newTime.setHours(parseInt(hours), parseInt(minutes));
            setSessionStartTime(newTime);
            setShowStartTimePicker(false);
          }}
          autoFocus
        />
      )}

      {Platform.OS === "web" && showEndTimePicker && (
        <input
          type="time"
          style={styles.webInput}
          defaultValue={sessionEndTime ? sessionEndTime.toLocaleTimeString("sq-AL", { hour: "2-digit", minute: "2-digit" }).replace(" ", "") : ""}
          onChange={(e) => {
            const [hours, minutes] = e.target.value.split(":");
            const newTime = new Date();
            newTime.setHours(parseInt(hours), parseInt(minutes));
            setSessionEndTime(newTime);
            setShowEndTimePicker(false);
          }}
          autoFocus
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#550000",
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  timeColumn: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 12,
    color: "#55000080",
    marginBottom: 6,
    fontWeight: "500",
  },
  timeButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#ffffff50",
    borderWidth: 1,
    borderColor: "#55000030",
    alignItems: "center",
  },
  timeText: {
    color: "#550000",
    fontSize: 14,
    fontWeight: "500",
  },
  webInput: {
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    border: "1px solid #55000050",
    backgroundColor: "#ffffff30",
    color: "#550000",
    fontSize: 15,
    textAlign: "center",
  },
});
