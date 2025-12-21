import { StyleSheet } from "react-native";

const SignupStyles = StyleSheet.create({
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
    marginBottom: 40,
    textAlign: "center",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#ffffff40",    
    borderWidth: 1,
    borderColor: "#55000070",
    borderRadius: 25,
    paddingVertical: 16,
    width: "100%",
    marginBottom: 16,
  },
  buttonText: {
    textAlign: "center",
    color: "#550000",
    fontWeight: "600",
    fontSize: 17,
  },
  loginText: {
    color: "#550000",
    textAlign: "center",
    fontSize: 15,
    marginTop: 20,
    fontWeight: "500",
  },
});

export default SignupStyles;