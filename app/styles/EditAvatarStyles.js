import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FAF0DC" 
},
  gradient: { 
    flex: 1, 
    paddingHorizontal: 30 
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
  scrollContent: { 
    paddingBottom: 40, 
    alignItems: "center" 
},
  formContainer: { 
    width: "100%", 
    alignItems: "center" 
},
  title: { 
    fontSize: 28, 
    fontWeight: "800", 
    color: "#550000", 
    marginBottom: 30 
},
  mainAvatarWrapper: { 
    width: 150, 
    height: 150, 
    borderRadius: 75, 
    borderWidth: 3, 
    borderColor: "#550000", 
    padding: 5, 
    marginBottom: 30, 
    justifyContent: "center", 
    alignItems: "center" 
},
  mainAvatar: { 
    width: 140, 
    height: 140, 
    borderRadius: 70 
},
  flatListContent: { 
    alignItems: "center" 
},
  avatarOption: { 
    margin: 10, 
    padding: 5, 
    borderRadius: 40, 
    borderWidth: 2, 
    borderColor: "transparent" 
},
  selectedAvatarOption: { 
    borderColor: "#550000", 
    backgroundColor: "#ffffff60" 
},
  avatarThumb: { 
    width: 70, 
    height: 70, 
    borderRadius: 35 
},
  saveButton: { 
    backgroundColor: "#550000", 
    paddingVertical: 14, 
    borderRadius: 25, 
    width: "100%", 
    marginTop: 20, 
    elevation: 8 
},
  saveButtonText: { 
    textAlign: "center", 
    color: "#FAF0DC", 
    fontWeight: "700", 
    fontSize: 16, 
    letterSpacing: 1 
},
});

export default styles;