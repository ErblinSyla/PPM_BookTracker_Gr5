import { StyleSheet, Platform } from "react-native";

const GitHubLoginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF0DC",
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,

    ...(Platform.OS === "web" && {
      maxWidth: 480,
      width: "100%",
      marginHorizontal: "auto",
    }),
  },
  formContainer: {
    width: "85%",
    maxWidth: 360,
    alignSelf: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 30,
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
    fontWeight: "500",
    fontSize: 16,
  },
  githubButton: {
    backgroundColor: "#ffffff40",     
    borderWidth: 1,
    borderColor: "#55000070",
    borderRadius: 25,
    paddingVertical: 16,
    width: "100%",
    alignItems: "center",
  },
  githubButtonText: {
    textAlign: "center",
    color: "#550000",
    fontWeight: "650",
    fontSize: 17,
  },
    backButtonContainer: {
    marginTop: 30,
  },
  backButtonText: {
    color: "#550000",
    fontSize: 16,
    fontWeight: "500",
    opacity: 0.8,
    textAlign: "center",
  },
});

export default GitHubLoginStyles;