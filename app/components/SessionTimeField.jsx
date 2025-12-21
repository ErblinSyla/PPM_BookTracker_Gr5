import { View, Text, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect } from "react";
import styles from "../styles/SessionTimeFieldStyles";

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
    const hours = String(time.getHours()).padStart(2, "0");
    const minutes = String(time.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
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
          {Platform.OS === "web" && showStartTimePicker ? (
            <input
              type="time"
              style={{...styles.webInput, display: "block"}}
              defaultValue={sessionStartTime ? `${String(sessionStartTime.getHours()).padStart(2, "0")}:${String(sessionStartTime.getMinutes()).padStart(2, "0")}` : ""}
              onChange={(e) => {
                const [hours, minutes] = e.target.value.split(":");
                const newTime = new Date();
                newTime.setHours(parseInt(hours), parseInt(minutes));
                setSessionStartTime(newTime);
                setShowStartTimePicker(false);
              }}
              onBlur={() => setShowStartTimePicker(false)}
              autoFocus
            />
          ) : (
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => {
                setShowStartTimePicker(true);
                setShowEndTimePicker(false);
              }}
            >
              <Text style={styles.timeText}>{formatTime(sessionStartTime)}</Text>
            </TouchableOpacity>
          )}
          {Platform.OS !== "web" && showStartTimePicker && (
            <DateTimePicker
              value={sessionStartTime || new Date()}
              mode="time"
              display="default"
              onChange={handleStartTimeChange}
            />
          )}
        </View>

        <View style={styles.timeColumn}>
          <Text style={styles.timeLabel}>End Time</Text>
          {Platform.OS === "web" && showEndTimePicker ? (
            <input
              type="time"
              style={{...styles.webInput, display: "block"}}
              defaultValue={sessionEndTime ? `${String(sessionEndTime.getHours()).padStart(2, "0")}:${String(sessionEndTime.getMinutes()).padStart(2, "0")}` : ""}
              onChange={(e) => {
                const [hours, minutes] = e.target.value.split(":");
                const newTime = new Date();
                newTime.setHours(parseInt(hours), parseInt(minutes));
                setSessionEndTime(newTime);
                setShowEndTimePicker(false);
              }}
              onBlur={() => setShowEndTimePicker(false)}
              autoFocus
            />
          ) : (
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => {
                setShowEndTimePicker(true);
                setShowStartTimePicker(false);
              }}
            >
              <Text style={styles.timeText}>{formatTime(sessionEndTime)}</Text>
            </TouchableOpacity>
          )}
          {Platform.OS !== "web" && showEndTimePicker && (
            <DateTimePicker
              value={sessionEndTime || new Date()}
              mode="time"
              display="default"
              onChange={handleEndTimeChange}
            />
          )}
        </View>
      </View>
    </View>
  );
}
