import { StyleSheet } from "react-native";

export default StyleSheet.create({
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    border: "1px solid #55000030",
    backgroundColor: "#ffffff50",
    color: "#550000",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "inherit",
    cursor: "pointer",
  },
});
