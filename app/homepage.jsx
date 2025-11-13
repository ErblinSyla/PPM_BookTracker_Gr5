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
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Homepage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const storedBooks = await AsyncStorage.getItem("books");
      if (storedBooks) {
        setBooks(JSON.parse(storedBooks));
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error("Error loading books:", error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadBooks();
    setRefreshing(false);
  }, []);

  const filteredBooks = books.filter((book) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      (book.title || "").toLowerCase().includes(q) ||
      (book.author || "").toLowerCase().includes(q)
    );
  });

  const goToDetails = (id) => {
    router.push({
      pathname: "/bookDetails",
      params: { bookId: id },
    });
  };

  const renderBookItem = ({ item }) => {
    // get initials from title for placeholder
    const initials = (item.title || "")
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => goToDetails(item.id)}
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
            {item.title}
          </Text>
          <Text style={styles.cardAuthor} numberOfLines={1}>
            {item.author}
          </Text>
          {item.dateAdded && (
            <Text style={styles.cardDate}>
              Added: {new Date(item.dateAdded).toLocaleDateString("sq-AL")}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>
        {searchQuery ? "No books found" : "No books existing"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? "Try a different searching word."
          : "Add the first book by pressing the + below."}
      </Text>
      <TouchableOpacity
        style={styles.emptyAddBtn}
        onPress={() => router.push("/addNewBook")}
      >
        <Text style={styles.emptyAddText}>Add new book</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={["#FAF0DC", "#F2EBE2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.logoRow}>
              <Image
                source={require("../assets/homepage.png")}
                style={styles.logo}
              />
              <Text style={styles.headerText}>Home</Text>
            </View>

            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => router.push("/profile")}//addNewBook
              accessibilityLabel="Add new book"
            >
              <Text style={styles.smallButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>Book List</Text>

          <TextInput
            placeholder="Search by the title or author..."
            placeholderTextColor={"#55000070"}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>

        {/* List */}
        <FlatList
          data={filteredBooks}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#550000"
              colors={["#550000"]}
            />
          }
        />

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/addNewBook")}
          >
            <Text style={styles.primaryButtonText}>Add New Book</Text>
            <Text style={styles.primaryButtonIcon}>＋</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              padding: 16,
              backgroundColor: "#550000",
              borderRadius: 8,
              marginTop: 20,
            }}
            onPress={() => router.push("/modifyBook")}
          >
            <Text style={{ color: "#FAF0DC", fontWeight: "700" }}>
              Open Update Page (Per testim, e largoj ne fund)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              padding: 16,
              backgroundColor: "#550000",
              borderRadius: 8,
              marginTop: 20,
            }}
            onPress={() => router.push("/modifyBook?editId=test-book-1")}
          >
            <Text style={{ color: "#FAF0DC", fontWeight: "700" }}>
              Open Update Page For Actual Book (Per testim, e largoj ne fund)
            </Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 40 : 28,
    paddingBottom: 12,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 28,
    height: 20,
    resizeMode: "cover",
    marginRight: 10,
  },
  headerText: {
    color: "#550000",
    fontWeight: "800",
    fontSize: 18,
  },
  title: {
    marginTop: 16,
    fontSize: 26,
    fontWeight: "800",
    color: "#550000",
    textAlign: "left",
    letterSpacing: 0.5,
  },
  searchInput: {
    marginTop: 12,
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#55000050",
    backgroundColor: "#ffffff40",
    color: "#550000",
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 120,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff40",
    borderRadius: 14,
    marginBottom: 14,
    overflow: "hidden",
    shadowColor: "#550000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  cover: {
    width: 110,
    height: 150,
    resizeMode: "cover",
  },
  coverPlaceholder: {
    width: 110,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff20",
  },
  coverInitials: {
    fontSize: 32,
    color: "#550000",
    fontWeight: "800",
  },
  cardContent: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  cardTitle: {
    color: "#550000",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
  },
  cardAuthor: {
    color: "#550000aa",
    fontSize: 14,
    marginBottom: 6,
  },
  cardDate: {
    color: "#55000080",
    fontSize: 12,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 22,
    alignItems: "center",
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    width: 320,
    maxWidth: "90%",
    height: 58,
    borderRadius: 25,
    backgroundColor: "#550000",
    justifyContent: "center",
    paddingHorizontal: 16,
    gap: 12,
    shadowColor: "#550000",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: "#FAF0DC",
    fontSize: 18,
    fontWeight: "700",
  },
  primaryButtonIcon: {
    color: "#FAF0DC",
    fontSize: 20,
    marginLeft: 8,
  },
  smallButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#ffffff40",
    borderWidth: 1,
    borderColor: "#55000040",
  },
  smallButtonText: {
    color: "#550000",
    fontWeight: "700",
  },
  emptyContainer: {
    paddingTop: 40,
    alignItems: "center",
    paddingHorizontal: 30,
  },
  emptyTitle: {
    color: "#550000",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },
  emptySubtitle: {
    color: "#550000aa",
    textAlign: "center",
    marginBottom: 16,
  },
  emptyAddBtn: {
    backgroundColor: "#ffffff30",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    borderColor: "#55000030",
    borderWidth: 1,
  },
  emptyAddText: {
    color: "#550000",
    fontWeight: "700",
  },
});
