// SignupEmailStyles.js
import { StyleSheet } from "react-native";

const SignupEmailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF0DC",
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  formContainer: {
    width: "85%",
    maxWidth: 360,
    alignSelf: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#550000",
    textAlign: "center",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  subtitle: {
    color: "#550000",
    marginBottom: 30,
    textAlign: "center",
    fontSize: 16,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#55000050",
    borderRadius: 12,
    paddingLeft: 14,
    color: "#550000",
    backgroundColor: "#ffffff20",
    marginBottom: 16,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "500",
    fontSize: 15,
  },
  signupButton: {
    backgroundColor: "#550000",
    paddingVertical: 16,
    borderRadius: 25,
    width: "100%",
    shadowColor: "#550000",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 20,
  },
  signupButtonText: {
    textAlign: "center",
    color: "#FAF0DC",
    fontWeight: "700",
    fontSize: 18,
  },
  backButtonContainer: {
    marginTop: 10,
  },
  backButtonText: {
    color: "#550000",
    fontSize: 16,
    fontWeight: "500",
    opacity: 0.8,
    textAlign: "center",
  },
  // Modal stilet
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FAF0DC",
    borderRadius: 20,
    padding: 30,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#55000030",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#550000",
    marginBottom: 12,
    textAlign: "center",
    textTransform: "uppercase",
  },
  modalMessage: {
    fontSize: 16,
    color: "#550000",
    marginBottom: 30,
    textAlign: "center",
    lineHeight: 24,
  },
  modalButton: {
    backgroundColor: "#550000",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
  },
  modalButtonText: {
    color: "#FAF0DC",
    fontWeight: "700",
    fontSize: 17,
  },
});

export default SignupEmailStyles;