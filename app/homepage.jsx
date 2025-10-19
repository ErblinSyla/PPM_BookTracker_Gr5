"use client"

import React, { useEffect, useState, useCallback } from "react"
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
} from "react-native"
import { StatusBar } from "expo-status-bar"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function Homepage() {
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [books, setBooks] = useState([])

  useEffect(() => {
    loadBooks()
  }, [])

  const loadBooks = async () => {
    try {
      const storedBooks = await AsyncStorage.getItem("books")
      if (storedBooks) {
        setBooks(JSON.parse(storedBooks))
      } else {
        setBooks([])
      }
    } catch (error) {
      console.error("Error loading books:", error)
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await loadBooks()
    setRefreshing(false)
  }, [])

  const filteredBooks = books.filter((book) => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return true
    return (
      (book.title || "").toLowerCase().includes(q) ||
      (book.author || "").toLowerCase().includes(q)
    )
  })

  const goToDetails = (id) => {
    router.push({
      pathname: "/bookDetails",
      params: { bookId: id },
    })
  }

  const renderBookItem = ({ item }) => {
    // get initials from title for placeholder
    const initials = (item.title || "")
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()

    return (
      <TouchableOpacity style={styles.card} onPress={() => goToDetails(item.id)}>
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
              Shtuar: {new Date(item.dateAdded).toLocaleDateString("sq-AL")}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    )
  }

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>{searchQuery ? "Nuk u gjetën libra" : "Nuk ka libra"}</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery ? "Provoni një term tjetër kërkimi." : "Shtoni librin e parë duke trokitur butonin + më poshtë."}
      </Text>
      <TouchableOpacity style={styles.emptyAddBtn} onPress={() => router.push("/addNewBook")}>
        <Text style={styles.emptyAddText}>Shto Libër të Ri</Text>
      </TouchableOpacity>
    </View>
  )

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
          <View style={styles.headerTop}>
            <View style={styles.logoRow}>
              <Image source={require("../assets/homepage.png")} style={styles.logo} />
              <Text style={styles.headerText}>Home</Text>
            </View>

            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => router.push("/addNewBook")}
              accessibilityLabel="Shto libër"
            >
              <Text style={styles.smallButtonText}>+ Shto</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>Lista e Librave</Text>

          <TextInput
            placeholder="Kërko sipas titullit ose autorit..."
            placeholderTextColor={"rgba(255,255,255,0.7)"}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>

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
              tintColor="#FFDD59"
              colors={["#FFDD59"]}
            />
          }
        />

        <View style={styles.footer}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/addNewBook")}>
            <Text style={styles.primaryButtonText}>Shto libër të ri</Text>
            <Text style={styles.primaryButtonIcon}>＋</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 32 : 20,
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
    color: "#FFDD59",
    fontWeight: "700",
    fontSize: 16,
  },
  title: {
    marginTop: 14,
    fontSize: 26,
    fontWeight: "800",
    color: "#FFDD59",
    textAlign: "left",
  },
  searchInput: {
    marginTop: 12,
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 0,
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "white",
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
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 12,
    marginBottom: 14,
    overflow: "hidden",
    // subtle shadow (iOS) / elevation (Android)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
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
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  coverInitials: {
    fontSize: 32,
    color: "#FFDD59",
    fontWeight: "800",
  },
  cardContent: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  cardTitle: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
  },
  cardAuthor: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 14,
    marginBottom: 6,
  },
  cardDate: {
    color: "rgba(255,255,255,0.6)",
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
    height: 60,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    justifyContent: "center",
    paddingHorizontal: 16,
    gap: 12,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  primaryButtonIcon: {
    color: "#FFDD59",
    fontSize: 20,
    marginLeft: 8,
  },
  smallButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  smallButtonText: {
    color: "#FFDD59",
    fontWeight: "700",
  },
  emptyContainer: {
    paddingTop: 40,
    alignItems: "center",
    paddingHorizontal: 30,
  },
  emptyTitle: {
    color: "#FFDD59",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },
  emptySubtitle: {
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginBottom: 16,
  },
  emptyAddBtn: {
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  emptyAddText: {
    color: "white",
    fontWeight: "700",
  },
})
