//import React, { useState, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Alert,View, Text, TextInput, Image, Button, StyleSheet, TouchableOpacity } from "react-native";
//import { CameraView, useCameraPermissions } from "expo-camera";
//import * as MediaLibrary from "expo-media-library";

export default function AddBookScreen() {
  //const [title, setTitle] = useState("");
  //const [author, setAuthor] = useState("");
  //const [coverUri, setCoverUri] = useState(null);
  //const [showCamera, setShowCamera] = useState(false);
  //const [permission, requestPermission] = useCameraPermissions();
  //const cameraRef = useRef(null);
  const handleTakePhoto = () => {
    console.log("User chose to take a photo");
  };
  const handleChooseFromGallery = () => {
    console.log("User chose from gallery");
  };

/*
  if (!permission) {
    return <View><Text>Duke kontrolluar lejet...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={{ textAlign: "center", marginBottom: 10 }}>
          Aplikacioni ka nevojë për qasje në kamerë për të ngarkuar kopertinën.
        </Text>
        <Button title="Lejo qasjen" onPress={requestPermission} />
      </View>
    );
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      await MediaLibrary.saveToLibraryAsync(photo.uri);
      setCoverUri(photo.uri);
      setShowCamera(false);
    }
  };

  // Nëse kamera është e hapur
  //<Text style={styles.captureButton}></Text>
  if (showCamera) {
    return (//
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} ref={cameraRef} facing="back" />
        <View style={styles.cameraButtons}>
         <TouchableOpacity style={styles.backButton} onPress={() => setShowCamera(false)}>
    <Text style={{fontSize:18}}>⏎</Text>
  </TouchableOpacity>


       <View style={styles.centerButtonContainer}>
        <View style={styles.captureOuter}>
            <View style={styles.captureInner}>
          <TouchableOpacity style={styles.captureButton} onPress={takePhoto} >
            
            </TouchableOpacity>
            </View>
            </View>
            </View>
        </View>
      </View>
    );
  }
*/
  return (
    <LinearGradient colors={["#522987", "#4e56c0"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
      }}>
    <View >
      <Text style={styles.title}>Shto Libër të Ri</Text>

      <TextInput
        placeholder="Titulli i librit"
        placeholderTextColor={"white"}
        style={styles.input}
        //value={title}
        //onChangeText={setTitle}
      />

      <TextInput
        placeholder="Autori"
        placeholderTextColor={"white"}

        style={styles.input}
        //value={author}
        //onChangeText={setAuthor}
      />

      
        <View style={styles.placeholder}>
          <Text style={{ color: "white" }}>Nuk ka kopertinë</Text>
        </View>
      

      <TouchableOpacity style={styles.uploadButton} onPress={() => {
    Alert.alert(
      "Upload Photo",
      "Choose an option:",
      [
        { text: "Take a Photo", onPress: () => handleTakePhoto() },
        { text: "Choose from Gallery", onPress: () => handleChooseFromGallery() },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  }}/*onPress={() => setShowCamera(true)}*/>
        <Text style={styles.uploadButtonText}>Ngarko kopertinën</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={() => alert("Libri u shtua!")}>
        <Text style={styles.saveButtonText}>Ruaj librin</Text>
      </TouchableOpacity>
    </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#FFDD59",
  },
  input: {
    width:300,
    height:50,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  coverImage: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
  },
  placeholder: {
    width: 300,
    height: 250,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  uploadButton: {
    backgroundColor: "#FFDD59",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  uploadButtonText: {
    color: "#4B0082",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#4B0082",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
    backgroundColor: "rgba(1,1,1,1)",
  },
  captureButton: {
    width: 6,
    height: 60,
    borderRadius: 100,
    backgroundColor : "white",
    padding:25,
    postion: "absolute",
    left: 8,
    top: 8,
  },
  backButton:{
    position: "absolute",
  left: 20,
  top: 25,
  width: 50,
  height: 50,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(255,255,255,0.7)",
  borderRadius: 25,
  },
  centerButtonContainer: {
    flexDirection: "row",
    justifyContent:"center",
    alignItems:"center",
  },
  captureOuter: {
  width: 80,
  height: 80,
  borderRadius: 100,
  backgroundColor: "white",
},
captureInner: {
  width: 70,
  height: 70,
  borderRadius: 100,
  position: "absolute",
  bottom: 5,
  left: 5,
  backgroundColor: "black",   // small white circle
},
  permissionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

});
/* {coverUri ? (
        <Image source={{ uri: coverUri }} style={styles.coverImage} />
      ) : (*/