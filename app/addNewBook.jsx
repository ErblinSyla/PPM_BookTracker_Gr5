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
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import styles from "./styles/AddNewBookStyles";

export default function AddNewBook() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState({});

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  const showAlert = (title, message) => {
    if (Platform.OS === "web") window.alert(`${title}: ${message}`);
    else Alert.alert(title, message);
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      showAlert("Permission needed", "Please allow access to your photos.");
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

  const showImagePickerOptions = () => {
    if (Platform.OS === "web") {
      setModalType("imagePicker");
      setModalVisible(true);
    } else {
      Alert.alert("Upload Cover", "Choose how to add a cover:", [
        { text: "Take Photo", onPress: () => setShowCamera(true) },
        { text: "Choose from Gallery", onPress: pickFromGallery },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  const handleImagePickerChoice = (choice) => {
    setModalVisible(false);
    if (choice === "camera") setShowCamera(true);
    else if (choice === "gallery") pickFromGallery();
  };

  const saveBook = async () => {
    if (!title.trim() || !author.trim()) {
      if (Platform.OS === "web") {
        setModalType("required");
        setModalData({ message: "Please enter both title and author." });
        setModalVisible(true);
      } else {
        Alert.alert("Required", "Please enter both title and author.");
      }
      return;
    }

    try {
      await addDoc(collection(db, "books"), {
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
      });

      if (Platform.OS === "web") {
        setModalType("success");
        setModalVisible(true);
      } else {
        Alert.alert("Success!", "Book added to your library.", [
          { text: "OK", onPress: () => router.replace("/homepage") },
        ]);
      }
    } catch (error) {
      console.error("Error adding book:", error);
      showAlert("Error", "Could not save book. Try again.");
    }
  };

  const handleSuccessConfirm = () => {
    setModalVisible(false);
    router.replace("/homepage");
  };

  const renderModal = () => {
    if (!modalVisible) return null;

    const titles = {
      imagePicker: "Upload Cover",
      required: "Required",
      success: "Success!",
    };

    const messages = {
      imagePicker: "Choose how to add a cover:",
      required: modalData.message,
      success: "Book added to your library.",
    };

    return (
      <Modal animationType="fade" transparent visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{titles[modalType]}</Text>
            <Text style={styles.modalMessage}>{messages[modalType]}</Text>

            <View style={styles.modalButtons}>
              {modalType === "imagePicker" && (
                <>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.optionButton]}
                    onPress={() => handleImagePickerChoice("camera")}
                  >
                    <Text style={styles.optionButtonText}>Take Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.optionButton]}
                    onPress={() => handleImagePickerChoice("gallery")}
                  >
                    <Text style={styles.optionButtonText}>
                      Choose from Gallery
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              )}

              {(modalType === "required" || modalType === "success") && (
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={
                    modalType === "success"
                      ? handleSuccessConfirm
                      : () => setModalVisible(false)
                  }
                >
                  <Text style={styles.confirmButtonText}>OK</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  if (!permission?.granted) {
    return (
      <LinearGradient colors={["#FAF0DC", "#F2EBE2"]} style={styles.container}>
        <SafeAreaView style={styles.safe}>
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
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} ref={cameraRef} facing="back" />
        <View style={styles.cameraOverlay}>
          <TouchableOpacity onPress={() => setShowCamera(false)}>
            <Text style={{ fontSize: 24, color: "white", fontWeight: "700" }}>
              Back
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={takePhoto}>
            <View style={styles.captureBtn} />
          </TouchableOpacity>
          <View style={{ width: 60 }} />
        </View>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#FAF0DC", "#F2EBE2"]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.webWrapper}>
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
                onPress={showImagePickerOptions}
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
        </View>

        {renderModal()}
      </SafeAreaView>
    </LinearGradient>
  );
}
