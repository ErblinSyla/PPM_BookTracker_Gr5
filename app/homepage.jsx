"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
  RefreshControl,
  Alert,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebaseConfig";

export default function Homepage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [books, setBooks] = useState([]);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        router.replace("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const loadBooks = useCallback(async () => {
    if (!userEmail) return;

    try {
      const q = query(
        collection(db, "books"),
        where("userEmail", "==", userEmail)
      );
      const querySnapshot = await getDocs(q);
      const booksList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(booksList);
    } catch (error) {
      console.error("Error loading books:", error);
      Alert.alert("Error", "Could not load your books.");
    }
  }, [userEmail]);

  useEffect(() => {
    if (userEmail) loadBooks();
  }, [userEmail, loadBooks]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadBooks().finally(() => setRefreshing(false));
  }, [loadBooks]);

  const filteredBooks = books.filter((book) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      (book.title || "").toLowerCase().includes(q) ||
      (book.author || "").toLowerCase().includes(q)
    );
  });

  const openBook = (id) => {
    router.push({
      pathname: "/modifyBook",
      params: { editId: id },
    });
  };

  const deleteBook = (id, title) => {
    Alert.alert("Delete Book", `Delete "${title || "this book"}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "books", id));
            await loadBooks();
            Alert.alert("Deleted", "Book removed.");
          } catch (error) {
            Alert.alert("Error", "Failed to delete.");
          }
        },
      },
    ]);
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await signOut(auth);
          router.replace("/login");
        },
      },
    ]);
  };

  const renderBookItem = ({ item }) => {
    const initials = (item.title || "")
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    return (
      <View style={styles.cardWrapper}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => openBook(item.id)}
          activeOpacity={0.8}
          onStartShouldSetResponder={() => true}
        >
          {item.cover ? (
            <Image source={{ uri: item.cover }} style={styles.cover} />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Text style={styles.coverInitials}>{initials || "LB"}</Text>
            </View>
          )}

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.title || "Untitled"}
            </Text>
            <Text style={styles.cardAuthor} numberOfLines={1}>
              {item.author || "Unknown Author"}
            </Text>
            {item.status && (
              <Text style={styles.statusBadge}>
                {item.status === "to-read" && "To Read"}
                {item.status === "reading" && "Reading"}
                {item.status === "finished" && "Finished"}
              </Text>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => deleteBook(item.id, item.title)}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (!userEmail) {
    return (
      <SafeAreaView style={styles.safe}>
        <LinearGradient
          colors={["#FAF0DC", "#F2EBE2"]}
          style={styles.container}
        >
          <View style={styles.loading}>
            <Text style={styles.loadingText}>Loading your library...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <LinearGradient colors={["#FAF0DC", "#F2EBE2"]} style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.logoRow}>
              <Image
                source={require("../assets/homepage.png")}
                style={styles.logo}
              />
              <Text style={styles.headerText}>My Library</Text>
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>My Books</Text>

          <TextInput
            placeholder="Search your books..."
            placeholderTextColor="#55000070"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <FlatList
          data={filteredBooks}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>
                {searchQuery ? "No books found" : "Your library is empty"}
              </Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery
                  ? "Try different keywords"
                  : "Add your first book!"}
              </Text>
              <TouchableOpacity
                style={styles.emptyAddBtn}
                onPress={() => router.push("/addNewBook")}
              >
                <Text style={styles.emptyAddText}>Add Book</Text>
              </TouchableOpacity>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/addNewBook")}
          >
            <Text style={styles.primaryButtonText}>Add New Book</Text>
            <Text style={styles.primaryButtonIcon}>Plus</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FAF0DC" },
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 18, color: "#550000" },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  logoRow: { flexDirection: "row", alignItems: "center" },
  logo: { width: 24, height: 24, marginRight: 10 },
  headerText: { color: "#550000", fontSize: 20, fontWeight: "800" },
  logoutBtn: {
    backgroundColor: "#550000",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: { color: "#FAF0DC", fontWeight: "700", fontSize: 14 },
  title: { fontSize: 28, fontWeight: "800", color: "#550000" },
  searchInput: {
    marginTop: 14,
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff50",
    borderWidth: 1,
    borderColor: "#55000040",
    color: "#550000",
    fontSize: 16,
  },
  listContainer: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 120 },

  cardWrapper: {
    marginBottom: 18,
    backgroundColor: "#ffffff50",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 5,
  },
  card: { flexDirection: "row", padding: 14 },
  cover: { width: 100, height: 140, borderRadius: 8 },
  coverPlaceholder: {
    width: 100,
    height: 140,
    backgroundColor: "#ffffff40",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  coverInitials: { fontSize: 32, fontWeight: "800", color: "#550000" },
  cardContent: { flex: 1, paddingLeft: 14, justifyContent: "center" },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#550000" },
  cardAuthor: { fontSize: 14, color: "#550000aa", marginTop: 4 },
  statusBadge: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
    color: "#550000",
    backgroundColor: "#55000020",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  deleteBtn: {
    backgroundColor: "#ff4444",
    paddingVertical: 14,
    alignItems: "center",
  },
  deleteBtnText: { color: "white", fontWeight: "700" },

  footer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  primaryButton: {
    flexDirection: "row",
    backgroundColor: "#550000",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    elevation: 10,
  },
  primaryButtonText: { color: "#FAF0DC", fontSize: 18, fontWeight: "700" },
  primaryButtonIcon: { color: "#FAF0DC", fontSize: 24, marginLeft: 8 },

  emptyContainer: { padding: 40, alignItems: "center" },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#550000",
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#550000aa",
    textAlign: "center",
    marginBottom: 20,
  },
  emptyAddBtn: {
    backgroundColor: "#550000",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyAddText: { color: "#FAF0DC", fontWeight: "700" },
});
