"use client";

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  SafeAreaView,
} from "react-native";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";

export default function AddNewBook() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow access to your photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setCover(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
    await MediaLibrary.saveToLibraryAsync(photo.uri);
    setCover(photo.uri);
    setShowCamera(false);
  };

  const saveBook = async () => {
    if (!title.trim() || !author.trim()) {
      Alert.alert("Required", "Please enter both title and author.");
      return;
    }

    try {
      const newBook = {
        title: title.trim(),
        author: author.trim(),
        description: description.trim() || null,
        cover: cover || null,
        userEmail: auth.currentUser?.email || "unknown",
        status: "to-read",
        pagesRead: null,
        totalPages: null,
        finishDate: null,
        notes: "",
        review: "",
        rating: 0,
        dateAdded: new Date().toISOString(),
      };

      await addDoc(collection(db, "books"), newBook);

      Alert.alert("Success!", "Book added to your library.", [
        { text: "OK", onPress: () => router.replace("/homepage") },
      ]);
    } catch (error) {
      console.error("Error adding book:", error);
      Alert.alert("Error", "Could not save book. Try again.");
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera access is needed to take book cover photos.
        </Text>
        <TouchableOpacity
          style={styles.permissionBtn}
          onPress={requestPermission}
        >
          <Text style={styles.permissionBtnText}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} ref={cameraRef} facing="back" />
        <View style={styles.cameraOverlay}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setShowCamera(false)}
          >
            <Text style={{ fontSize: 24 }}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={takePhoto}>
            <View style={styles.captureBtn} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#FAF0DC", "#F2EBE2"]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.backBtn}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add New Book</Text>
            <View style={{ width: 28 }} />
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter book title"
              placeholderTextColor="#55000070"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Author</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter author name"
              placeholderTextColor="#55000070"
              value={author}
              onChangeText={setAuthor}
            />

            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add a short description..."
              placeholderTextColor="#55000070"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <TouchableOpacity
              style={styles.imageBtn}
              onPress={() =>
                Alert.alert("Upload Cover", "Choose how to add a cover:", [
                  { text: "Take Photo", onPress: () => setShowCamera(true) },
                  { text: "Choose from Gallery", onPress: pickFromGallery },
                  { text: "Cancel", style: "cancel" },
                ])
              }
            >
              <Text style={styles.imageBtnText}>
                {cover ? "Change Cover" : "Upload Cover"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={saveBook}>
              <Text style={styles.saveText}>Add Book</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FAF0DC" },
  container: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingBottom: 80 },
  header: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backBtn: { color: "#550000", fontSize: 26, fontWeight: "700" },
  headerTitle: { color: "#550000", fontSize: 18, fontWeight: "700" },
  form: {
    backgroundColor: "#ffffff40",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#550000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 3,
  },
  label: {
    color: "#550000",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#ffffff60",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    color: "#550000",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#55000050",
  },
  textArea: { height: 100, textAlignVertical: "top" },
  imageBtn: {
    marginTop: 20,
    backgroundColor: "#ffffff40",
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#55000050",
  },
  imageBtnText: { color: "#550000", fontWeight: "700", fontSize: 15 },
  saveBtn: {
    marginTop: 30,
    backgroundColor: "#550000",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  saveText: { color: "white", fontSize: 17, fontWeight: "700" },

  cameraContainer: { flex: 1 },
  camera: { flex: 1 },
  cameraOverlay: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  captureBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    borderWidth: 6,
    borderColor: "#333",
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
    marginBottom: 20,
    color: "#550000",
    fontSize: 16,
  },
  permissionBtn: {
    backgroundColor: "#550000",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  permissionBtnText: { color: "#FAF0DC", fontWeight: "700" },
});
