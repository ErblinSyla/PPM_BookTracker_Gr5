import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: {
    paddingTop: 25,
    paddingHorizontal: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scroll: { paddingHorizontal: 25, paddingBottom: 100 },
  container: {
    maxWidth: 500,
    alignSelf: "center",
    width: "100%",
  },
  bookInfo: { alignItems: "center", marginBottom: 30, marginTop: 20 },
  bookTitle: {
    color: "#550000",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 4,
  },
  bookAuthor: { color: "#550000bb", fontSize: 15, fontStyle: "italic" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#550000", fontSize: 18, fontWeight: "600" },
  buttonContainer: {
    maxWidth: 300,
  },
});
