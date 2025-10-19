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
    Alert.alert("Confirm", "Are you sure that you want to delete this book?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
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
        <Text style={styles.loadingText}>Loading...</Text>
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
      <StatusBar style="dark" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={["#FAF0DC", "#F2EBE2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book Details</Text>
          <View style={{ width: 40 }} />
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
              <Text style={styles.bookAuthor}>from {book.author}</Text>

              {book.dateAdded && (
                <Text style={styles.bookDate}>
                  Added on: {new Date(book.dateAdded).toLocaleDateString("sq-AL")}
                </Text>
              )}

              {book.description ? (
                <Text style={styles.bookDescription}>{book.description}</Text>
              ) : (
                <Text style={styles.bookDescriptionMuted}>
                  This book has no description.
                </Text>
              )}
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                router.push({ pathname: "/addNewBook", params: { editId: book.id } })
              }
            >
              <Text style={styles.editText}>✏️ Update</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={deleteBook}>
              <Text style={styles.deleteText}>🗑️ Delete</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FAF0DC",
  },
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    color: "#550000",
    fontSize: 16,
    fontWeight: "600",
  },
  headerTitle: {
    color: "#550000",
    fontSize: 20,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  scroll: {
    paddingHorizontal: 25,
    paddingBottom: 100,
  },
  bookCard: {
    marginTop: 30,
    backgroundColor: "#ffffff40",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#550000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 6,
  },
  cover: {
    width: 160,
    height: 220,
    borderRadius: 14,
    marginBottom: 20,
    shadowColor: "#550000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  coverPlaceholder: {
    width: 160,
    height: 220,
    borderRadius: 14,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff30",
    borderWidth: 1,
    borderColor: "#55000040",
  },
  coverInitials: {
    fontSize: 40,
    color: "#550000",
    fontWeight: "800",
  },
  info: {
    alignItems: "center",
  },
  bookTitle: {
    color: "#550000",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
    textAlign: "center",
  },
  bookAuthor: {
    color: "#550000bb",
    fontSize: 16,
    marginBottom: 8,
    fontStyle: "italic",
  },
  bookDate: {
    color: "#55000080",
    fontSize: 13,
    marginBottom: 16,
  },
  bookDescription: {
    color: "#550000",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  bookDescriptionMuted: {
    color: "#55000080",
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
    backgroundColor: "#550000",
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 24,
    shadowColor: "#550000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  editText: {
    color: "#FAF0DC",
    fontWeight: "700",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#ffffff30",
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: "#55000050",
    shadowColor: "#550000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  deleteText: {
    color: "#A22B2B",
    fontWeight: "700",
    fontSize: 16,
  },
});
