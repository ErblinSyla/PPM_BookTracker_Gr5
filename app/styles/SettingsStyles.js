import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    alignSelf: "center",
    width: "100%",
  },
  innerContainer: {
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  header: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  backBtn: {
    color: "#550000",
    fontSize: 26,
    fontWeight: "700",
  },
  pageTitle: {
    color: "#550000",
    fontSize: 24,
    fontWeight: "800",
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    zIndex: -1,
  },
  contentContainer: {
    gap: 30,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FCF7E6",
    padding: 18,
    borderRadius: 20,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#550000",
  },
  settingDesc: {
    fontSize: 14,
    color: "#550000",
    opacity: 0.6,
    marginTop: 4,
  },
  passwordSection: {
    backgroundColor: "#FCF7E6",
    padding: 24,
    borderRadius: 20,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#550000",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FAF0DC",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 16,
    color: "#550000",
    borderWidth: 1,
    borderColor: "rgba(85, 0, 0, 0.1)",
  },
  saveButton: {
    backgroundColor: "#550000",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#FAF0DC",
    fontSize: 18,
    fontWeight: "700",
  },
});

export default styles;
