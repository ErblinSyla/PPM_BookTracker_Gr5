import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },

  scrollContent: { 
    padding: 20, 
    alignItems: "center" 
  },

  avatarSection: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#ffffff30",
    padding: 15,
    borderRadius: 20,
    elevation: 5,
  },

  avatar: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    marginBottom: 10 
  },

  editAvatarText: { 
    color: "#550000", 
    fontWeight: "600", 
    fontSize: 16 
  },

  label: { 
    alignSelf: "flex-start", 
    color: "#550000", 
    fontWeight: "600", 
    marginBottom: 5, 
    marginTop: 15 
  },

  input: {
    width: 300,
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#ffffff20",
    color: "#550000",
    borderWidth: 1,
    borderColor: "#55000050",
    marginBottom: 15,
  },

  saveBtn: {
    backgroundColor: "#550000",
    paddingVertical: 14,
    borderRadius: 25,
    width: 300,
    alignItems: "center",
    marginBottom: 40,
  },

  saveText: { 
    color: "#FAF0DC", 
    fontWeight: "700", 
    fontSize: 16 
  },

  backButton: { 
    marginTop: 10, 
    marginBottom: 20 
  },

  backText: { 
    color: "#550000", 
    fontWeight: "700", 
    letterSpacing: 1 
  },
});

export default styles;
