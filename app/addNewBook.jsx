"use client";

import React, { useState, useEffect, useMemo } from "react";
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
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";
import { useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { onAuthStateChanged } from "firebase/auth";
import styles from "./styles/AddNewBookStyles";

import ModalComponent from "./components/ModalComponent.jsx";
import CameraCapture from "./components/CameraCapture.jsx";
import CoverPickerButton from "./components/CoverPickerButton.jsx";
import PermissionRequest from "./components/PermissionRequest.jsx";

const AddNewBook = () => {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState({});

  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserEmail(user.email);
      else router.replace("/login");
    });
    return () => unsubscribe();
  }, [router]);

  const modalTitles = useMemo(
    () => ({
      imagePicker: "Upload Cover",
      required: "Required",
      success: "Success!",
    }),
    []
  );

  const modalMessages = useMemo(
    () => ({
      imagePicker: "Choose how to add a cover:",
      required: modalData.message,
      success: "Book added to your library.",
    }),
    [modalData.message]
  );

  const compressImage = async (uri) => {
    const result = await ImageManipulator.manipulateAsync(uri, [], {
      compress: 0.7,
      format: ImageManipulator.SaveFormat.JPEG,
    });
    return result.uri;
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
      quality: 0.5,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      const compressedUri = await compressImage(result.assets[0].uri);
      setCover(compressedUri);
    }
  };

  const takePhoto = async (photo) => {
    await MediaLibrary.saveToLibraryAsync(photo.uri);
    const compressedUri = await compressImage(photo.uri);
    setCover(compressedUri);
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
      setModalType("required");
      setModalData({ message: "Please enter both title and author." });
      setModalVisible(true);
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
      setModalType("success");
      setModalVisible(true);
    } catch (error) {
      setModalType("error");
      setModalData({
        message:
          "Could not save the book.\nPlease check your connection and try again.",
      });
      setModalVisible(true);
    }
  };

  const handleSuccessConfirm = () => {
    setModalVisible(false);
    if (modalType === "success") {
      router.replace("/homepage");
    }
  };

  if (!permission?.granted) {
    return (
      <LinearGradient colors={["#FAF0DC", "#F2EBE2"]} style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <PermissionRequest
            message="Camera access is needed to take book cover photos."
            onRequest={requestPermission}
          />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (showCamera) {
    return (
      <CameraCapture
        onBack={() => setShowCamera(false)}
        onCapture={takePhoto}
      />
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

              <CoverPickerButton
                cover={cover}
                onPress={showImagePickerOptions}
              />

              <TouchableOpacity style={styles.saveBtn} onPress={saveBook}>
                <Text style={styles.saveText}>Add Book</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        <ModalComponent
          visible={modalVisible}
          type={modalType}
          message={modalData.message}
          onChoice={handleImagePickerChoice}
          onConfirm={handleSuccessConfirm}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default React.memo(AddNewBook);
