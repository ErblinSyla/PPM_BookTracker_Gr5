"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
  RefreshControl,
  Alert,
  Platform,
  Modal,
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
import { styles } from "./styles/HomepageStyles";

export default function Homepage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [books, setBooks] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState({});

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
      showAlert("Error", "Could not load your books.");
    }
  }, [userEmail]);

  useEffect(() => {
    if (userEmail) loadBooks();
  }, [userEmail, loadBooks]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadBooks().finally(() => setRefreshing(false));
  }, [loadBooks]);

  const showAlert = (title, message) => {
    if (Platform.OS === "web") {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const filteredBooks = books.filter((book) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      (book.title || "").toLowerCase().includes(q) ||
      (book.author || "").toLowerCase().includes(q)
    );
  });

  const openBook = (id) => {
    router.push({ pathname: "/modifyBook", params: { editId: id } });
  };

  const showDeleteConfirmation = (id, title) => {
    if (Platform.OS === "web") {
      setModalType("delete");
      setModalData({ id, title });
      setModalVisible(true);
    } else {
      Alert.alert("Delete Book", `Delete "${title || "this book"}"?`, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => performDeleteBook(id),
        },
      ]);
    }
  };

  const showLogoutConfirmation = () => {
    if (Platform.OS === "web") {
      setModalType("logout");
      setModalVisible(true);
    } else {
      Alert.alert("Logout", "Are you sure?", [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: performLogout },
      ]);
    }
  };

  const performDeleteBook = async (id) => {
    try {
      await deleteDoc(doc(db, "books", id));
      await loadBooks();
      showAlert("Deleted", "Book removed.");
    } catch (error) {
      showAlert("Error", "Failed to delete.");
    }
  };

  const performLogout = async () => {
    await signOut(auth);
    router.replace("/");
  };

  const handleModalConfirm = async () => {
    setModalVisible(false);
    if (modalType === "delete") await performDeleteBook(modalData.id);
    if (modalType === "logout") await performLogout();
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
          onPress={() => showDeleteConfirmation(item.id, item.title)}
        >
          <Text style={styles.deleteBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {modalType === "logout" ? "Logout" : "Delete Book"}
          </Text>
          <Text style={styles.modalMessage}>
            {modalType === "logout"
              ? "Are you sure you want to logout?"
              : `Delete "${modalData.title || "this book"}"?`}
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={handleModalConfirm}
            >
              <Text style={styles.confirmButtonText}>
                {modalType === "logout" ? "Logout" : "Delete"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

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
        <View style={styles.webWrapper}>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.logoRow}>
                <Image
                  source={require("../assets/homepage.png")}
                  style={styles.logo}
                />
                <Text style={styles.headerText}>My Library</Text>
              </View>
              <TouchableOpacity
                style={styles.profileBtn}
                onPress={()=>router.push("/profile")}
              > 


                <Image 
                  source={require("../assets/profile_username-icon.png")}
                  style={styles.profileIcon}
                />
                <Text style={styles.profileText}>Profile</Text>
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
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/addNewBook")}
          >
            <Text style={styles.primaryButtonText}>Add New Book</Text>
          </TouchableOpacity>
        </View>

        {renderModal()}
      </LinearGradient>
    </SafeAreaView>
  );
}
