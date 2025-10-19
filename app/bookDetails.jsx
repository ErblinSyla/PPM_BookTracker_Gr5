"use client"

import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { LinearGradient } from "expo-linear-gradient"
import { StatusBar } from "expo-status-bar"

export default function BookDetails() {
  const router = useRouter()
  const { bookId } = useLocalSearchParams()
  const [book, setBook] = useState(null)

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const storedBooks = await AsyncStorage.getItem("books")
        if (storedBooks) {
          const booksArray = JSON.parse(storedBooks)
          const foundBook = booksArray.find((b) => b.id === bookId)
          if (foundBook) {
            setBook(foundBook)
          }
        }
      } catch (error) {
        console.error("Error loading book details:", error)
      }
    }

    fetchBook()
  }, [bookId])

  const deleteBook = async () => {
    Alert.alert("Konfirmim", "A jeni i sigurt që doni ta fshini këtë libër?", [
      { text: "Anulo", style: "cancel" },
      {
        text: "Fshi",
        style: "destructive",
        onPress: async () => {
          try {
            const storedBooks = await AsyncStorage.getItem("books")
            if (storedBooks) {
              const booksArray = JSON.parse(storedBooks)
              const updatedBooks = booksArray.filter((b) => b.id !== bookId)
              await AsyncStorage.setItem("books", JSON.stringify(updatedBooks))
            }
            router.back()
          } catch (error) {
            console.error("Error deleting book:", error)
          }
        },
      },
    ])
  }

  if (!book) {
    return (
      <LinearGradient
        colors={["#522987", "#4e56c0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.loadingContainer}
      >
        <StatusBar style="light" />
        <Text style={styles.loadingText}>Duke ngarkuar...</Text>
      </LinearGradient>
    )
  }

  const initials = (book.title || "")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#522987", "#4e56c0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backBtn}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detajet e Librit</Text>
          <View style={{ width: 28 }} /> 
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.bookCard}>
            {book.cover ? (
              <Image source={{ uri: book.cover }} style={styles.cover} />
            ) : (
              <View style={styles.coverPlaceholder}>
                <Text style={styles.coverInitials}>{initials || "LB"}</Text>
              </View>
            )}

            <View style={styles.info}>
              <Text style={styles.bookTitle}>{book.title}</Text>
              <Text style={styles.bookAuthor}>nga {book.author}</Text>
              {book.dateAdded && (
                <Text style={styles.bookDate}>
                  Shtuar më: {new Date(book.dateAdded).toLocaleDateString("sq-AL")}
                </Text>
              )}
              {book.description ? (
                <Text style={styles.bookDescription}>{book.description}</Text>
              ) : (
                <Text style={styles.bookDescriptionMuted}>
                  Ky libër nuk ka përshkrim.
                </Text>
              )}
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push({ pathname: "/addNewBook", params: { editId: book.id } })}
            >
              <Text style={styles.editText}>✏️ Përditëso</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={deleteBook}>
              <Text style={styles.deleteText}>🗑️ Fshi</Text>
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
    backgroundColor: "#522987",
  },
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  bookCard: {
    marginTop: 30,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 4,
  },
  cover: {
    width: 150,
    height: 210,
    borderRadius: 12,
    marginBottom: 20,
  },
  coverPlaceholder: {
    width: 150,
    height: 210,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  coverInitials: {
    fontSize: 40,
    color: "#FFDD59",
    fontWeight: "800",
  },
  info: {
    alignItems: "center",
  },
  bookTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
    textAlign: "center",
  },
  bookAuthor: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
    marginBottom: 8,
  },
  bookDate: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    marginBottom: 16,
  },
  bookDescription: {
    color: "white",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  bookDescriptionMuted: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 15,
    textAlign: "center",
    fontStyle: "italic",
  },
  actions: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  editButton: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 22,
  },
  editText: {
    color: "#FFDD59",
    fontWeight: "700",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 22,
  },
  deleteText: {
    color: "#ff7b7b",
    fontWeight: "700",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
})
