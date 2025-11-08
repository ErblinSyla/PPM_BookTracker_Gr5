import { View, Text, TextInput } from "react-native";
import * as Progress from "react-native-progress";
import { StyleSheet } from "react-native";

export default function ProgressField({
  pagesRead,
  setPagesRead,
  totalPages,
  setTotalPages,
  progress,
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>Reading Progress</Text>
      <View style={styles.progressRow}>
        <TextInput
          style={styles.inputSmall}
          value={pagesRead}
          onChangeText={setPagesRead}
          keyboardType="numeric"
          placeholder="0"
        />
        <Text style={styles.slash}>/</Text>
        <TextInput
          style={styles.inputSmall}
          value={totalPages}
          onChangeText={setTotalPages}
          keyboardType="numeric"
          placeholder="###"
        />
        <Text style={styles.pagesText}>pages</Text>
      </View>
      <Progress.Bar
        progress={progress}
        width={null}
        height={10}
        color="#550000"
        unfilledColor="#55000030"
        borderWidth={0}
        borderRadius={5}
        style={styles.progressBar}
      />
      <Text style={styles.progressText}>
        {progress === 1 ? "Completed!" : `${Math.round(progress * 100)}% read`}
      </Text>
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
  progressRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  inputSmall: {
    borderWidth: 1,
    borderColor: "#55000050",
    borderRadius: 8,
    padding: 10,
    width: 70,
    textAlign: "center",
    backgroundColor: "#ffffff30",
    color: "#550000",
    fontWeight: "600",
  },
  slash: { marginHorizontal: 8, fontSize: 16, color: "#550000" },
  pagesText: { marginLeft: 8, color: "#550000", fontWeight: "600" },
  progressBar: { marginTop: 8 },
  progressText: {
    marginTop: 6,
    fontSize: 14,
    color: "#550000",
    textAlign: "center",
    fontWeight: "600",
  },
});
