"use client"

import React, { useEffect, useState, useRef } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Platform,
  Button,
} from "react-native"
import { StatusBar } from "expo-status-bar"
import { useRouter, useLocalSearchParams } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { CameraView, useCameraPermissions } from "expo-camera"
import * as MediaLibrary from "expo-media-library"
import { LinearGradient } from "expo-linear-gradient"
import * as ImagePicker from "expo-image-picker"

export default function AddNewBook() {
  const router = useRouter()
  const { editId } = useLocalSearchParams()

  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [description, setDescription] = useState("")
  const [cover, setCover] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [permission, requestPermission] = useCameraPermissions()
  const cameraRef = useRef(null)

  useEffect(() => {
    if (editId) loadBookForEditing(editId)
  }, [editId])

  const loadBookForEditing = async (id) => {
    try {
      const storedBooks = await AsyncStorage.getItem("books")
      if (storedBooks) {
        const booksArray = JSON.parse(storedBooks)
        const bookToEdit = booksArray.find((b) => b.id === id)
        if (bookToEdit) {
          setTitle(bookToEdit.title || "")
          setAuthor(bookToEdit.author || "")
          setDescription(bookToEdit.description || "")
          setCover(bookToEdit.cover || null)
          setIsEditing(true)
        }
      }
    } catch (error) {
      console.error("Error loading book for edit:", error)
    }
  }

  const ChooseFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Error", "Permission to access the gallery is required!")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      setCover(result.assets[0].uri)
    }
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync()
      await MediaLibrary.saveToLibraryAsync(photo.uri)
      setCover(photo.uri)
      setShowCamera(false)
    }
  }

  const saveBook = async () => {
    if (!title.trim() || !author.trim()) {
      Alert.alert("Error", "Please fill in at least the title and author.")
      return
    }

    try {
      const storedBooks = await AsyncStorage.getItem("books")
      const booksArray = storedBooks ? JSON.parse(storedBooks) : []

      if (isEditing) {
        const updatedBooks = booksArray.map((b) =>
          b.id === editId ? { ...b, title, author, description, cover } : b
        )
        await AsyncStorage.setItem("books", JSON.stringify(updatedBooks))
      } else {
        const newBook = {
          id: Date.now().toString(),
          title,
          author,
          description,
          cover,
          dateAdded: new Date().toISOString(),
        }
        booksArray.push(newBook)
        await AsyncStorage.setItem("books", JSON.stringify(booksArray))
      }

      Alert.alert("Success", isEditing ? "Book updated successfully." : "Book added successfully.")
      router.push("/homepage")
    } catch (error) {
      console.error("Error saving book:", error)
    }
  }

  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <Text>Checking permissions...</Text>
      </View>
    )
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={{ textAlign: "center", marginBottom: 10 }}>
          The app requires camera access to upload the book cover.
        </Text>
        <Button title="Allow access" onPress={requestPermission} />
      </View>
    )
  }

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} ref={cameraRef} facing="back" />
        <View style={styles.cameraButtons}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowCamera(false)}
          >
            <Text style={{ fontSize: 18 }}>⏎</Text>
          </TouchableOpacity>

          <View style={styles.centerButtonContainer}>
            <View style={styles.captureOuter}>
              <View style={styles.captureInner}>
                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={takePhoto}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }

  return (
     <LinearGradient
        colors={["#FAF0DC", "#F2EBE2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
     
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.backBtn}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {isEditing ? "Update Book" : "Add New Book"}
            </Text>
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

            <Text style={styles.label}>Description</Text>
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
              onPress={() => {
                Alert.alert(
                  "Upload Photo",
                  "Choose an option:",
                  [
                    { text: "Take a Photo", onPress: () => setShowCamera(true) },
                    { text: "Choose from Gallery", onPress: () => ChooseFromGallery() },
                    { text: "Cancel", style: "cancel" },
                  ],
                  { cancelable: true }
                )
              }}
            >
              <Text style={styles.imageBtnText}>Upload Cover</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={saveBook}>
              <Text style={styles.saveText}>
                {isEditing ? "Save Changes" : "Add Book"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
     
    </SafeAreaView>
     </LinearGradient>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FAF0DC",
  },
  container: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  header: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backBtn: {
    color: "#550000",
    fontSize: 26,
    fontWeight: "700",
  },
  headerTitle: {
    color: "#550000",
    fontSize: 18,
    fontWeight: "700",
  },
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
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  imageBtn: {
    marginTop: 20,
    backgroundColor: "#ffffff40",
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#55000050",
    shadowColor: "#550000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  imageBtnText: {
    color: "#550000",
    fontWeight: "700",
    fontSize: 15,
  },
  saveBtn: {
    marginTop: 30,
    backgroundColor: "#550000",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#550000",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  saveText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
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
    width: 20,
    height: 20,
    borderRadius: 100,
    backgroundColor: "white",
    padding: 30,
    position: "absolute",
    left: 5,
    top: 5,
  },
  backButton: {
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
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: "black",
  },
  permissionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
})
