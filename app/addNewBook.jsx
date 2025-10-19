"use client"

import React, { useEffect, useState } from "react"
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
} from "react-native"
import { StatusBar } from "expo-status-bar"
import { useRouter, useLocalSearchParams } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
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

  useEffect(() => {
    if (editId) {
      loadBookForEditing(editId)
    }
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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    })
    if (!result.canceled) {
      setCover(result.assets[0].uri)
    }
  }

  const saveBook = async () => {
    if (!title.trim() || !author.trim()) {
      Alert.alert("Error", "Please fill at least the title and author section.")
      return
    }

    try {
      const storedBooks = await AsyncStorage.getItem("books")
      const booksArray = storedBooks ? JSON.parse(storedBooks) : []

      if (isEditing) {
        // Update existing book
        const updatedBooks = booksArray.map((b) =>
          b.id === editId ? { ...b, title, author, description, cover } : b
        )
        await AsyncStorage.setItem("books", JSON.stringify(updatedBooks))
      } else {
        // Add new book
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

      Alert.alert("Success", isEditing ? "The book has been updated successfully." : "The book has been added successfully.")
      router.push("/homepage")
    } catch (error) {
      console.error("Error saving book:", error)
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#522987", "#4e56c0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.backBtn}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {isEditing ? "Update Book" : "Add new book"}
            </Text>
            <View style={{ width: 28 }} />
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Book title"
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Author</Text>
            <TextInput
              style={styles.input}
              placeholder="Author's name"
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={author}
              onChangeText={setAuthor}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add a short description"
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
              <Text style={styles.imageBtnText}>
                {cover ? "📚 Change book cover" : "📘 Choose a book cover"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={saveBook}>
              <Text style={styles.saveText}>{isEditing ? "Save changes" : "Add book"}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
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
    color: "#FFDD59",
    fontSize: 26,
    fontWeight: "700",
  },
  headerTitle: {
    color: "#FFDD59",
    fontSize: 18,
    fontWeight: "700",
  },
  form: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 3,
  },
  label: {
    color: "#FFDD59",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    color: "white",
    fontSize: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  imageBtn: {
    marginTop: 20,
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  imageBtnText: {
    color: "#FFDD59",
    fontWeight: "700",
  },
  saveBtn: {
    marginTop: 30,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  saveText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },
})
