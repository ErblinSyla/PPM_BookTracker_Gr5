import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FAF0DC" },
  container: { maxWidth: 500, alignSelf: "center", width: "100%" },
  webWrapper: {
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
    flex: 1,
    paddingHorizontal: Platform.OS === "web" ? 16 : 0,
    marginHorizontal: "auto",
    paddingRight: Platform.OS === "web" ? 8 : 0,
  },
  scroll: { paddingHorizontal: 24, paddingBottom: 50 },

  header: {
    marginTop: 20,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backBtn: { color: "#550000", fontSize: 26, fontWeight: "700" },
  headerTitle: { color: "#550000", fontSize: 20, fontWeight: "800" },

  form: {
    backgroundColor: "#ffffff40",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#550000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    color: "#550000",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#ffffff60",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 16 : 12,
    color: "#550000",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#55000050",
  },
  textArea: { height: 120, textAlignVertical: "top", paddingTop: 14 },

  imageBtn: {
    marginTop: 24,
    backgroundColor: "#ffffff40",
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#55000050",
  },
  imageBtnText: { color: "#550000", fontWeight: "700", fontSize: 16 },

  saveBtn: {
    marginTop: 32,
    backgroundColor: "#550000",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    elevation: 8,
  },
  saveText: { color: "#FAF0DC", fontSize: 18, fontWeight: "700" },

  cameraContainer: { flex: 1 },
  camera: { flex: 1 },
  cameraOverlay: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  captureBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "white",
    borderWidth: 6,
    borderColor: "#333333",
  },

  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#FAF0DC",
  },
  permissionText: {
    textAlign: "center",
    marginBottom: 24,
    color: "#550000",
    fontSize: 17,
    lineHeight: 24,
  },
  permissionBtn: {
    backgroundColor: "#550000",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
  },
  permissionBtnText: { color: "#FAF0DC", fontWeight: "700", fontSize: 16 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 28,
    width: "100%",
    maxWidth: 400,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#550000",
    textAlign: "center",
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: "#550000",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtons: {
    gap: 12,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  optionButton: {
    backgroundColor: "#550000",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    marginTop: 8,
  },
  confirmButton: {
    backgroundColor: "#550000",
  },
  optionButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  cancelButtonText: {
    color: "#550000",
    fontWeight: "600",
    fontSize: 16,
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default styles;
