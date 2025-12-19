"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
  StatusBar,
  StyleSheet,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

const AVATARS = [
  { id: "1", image: require("../assets/avatar01.png") },
  { id: "2", image: require("../assets/avatar02.png") },
  { id: "3", image: require("../assets/avatar03.png") },
  { id: "4", image: require("../assets/avatar04.png") },
  { id: "5", image: require("../assets/avatar05.png") },
  { id: "6", image: require("../assets/avatar06.png") },
  { id: "7", image: require("../assets/avatar07.png") },
  { id: "8", image: require("../assets/avatar08.png") },
  { id: "9", image: require("../assets/avatar09.png") },
  { id: "10", image: require("../assets/avatar10.png") },
  { id: "11", image: require("../assets/avatar11.png") },
  { id: "12", image: require("../assets/avatar12.png") },
  { id: "13", image: require("../assets/avatar13.png") },
  { id: "14", image: require("../assets/avatar14.png") },
  { id: "15", image: require("../assets/avatar15.png") },
];

export default function EditProfile() {
  const router = useRouter();
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].image);

  const [userEmail, setUserEmail] = useState(null);
  const [providerId, setProviderId] = useState("");
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
        const provider = user.providerData[0]?.providerId;
        setProviderId(provider || "");
        setIsLoadingAuth(false);
      } else {
        setUserEmail(null);
        setProviderId("");
        setIsLoadingAuth(false);
        router.replace("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    const loadAvatar = async () => {
      try {
        const avatar = await AsyncStorage.getItem("userAvatar");
        if (avatar) setSelectedAvatar(JSON.parse(avatar));
      } catch (error) {
        console.log("Error loading avatar:", error);
      }
    };
    loadAvatar();
  }, []);

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem("userAvatar", JSON.stringify(selectedAvatar));
      router.back();
    } catch (error) {
      console.log("Error saving avatar:", error);
    }
  };

  if (isLoadingAuth) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <LinearGradient colors={["#FAF0DC", "#F2EBE2"]} style={styles.gradient}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>← BACK</Text>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View
            style={[
              styles.formContainer,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Text style={styles.title}>Edit Profile</Text>
            <Text style={styles.subtitle}>Choose your reading persona</Text>

            <View style={styles.mainAvatarWrapper}>
              <Image source={selectedAvatar} style={styles.mainAvatar} />
            </View>

            <View style={styles.avatarListContainer}>
              <FlatList
                data={AVATARS}
                keyExtractor={(item) => item.id}
                numColumns={3}
                contentContainerStyle={styles.flatListContent}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => setSelectedAvatar(item.image)}
                    style={[
                      styles.avatarOption,
                      selectedAvatar === item.image &&
                        styles.selectedAvatarOption,
                    ]}
                    activeOpacity={0.8}
                  >
                    <Image source={item.image} style={styles.avatarThumb} />
                  </TouchableOpacity>
                )}
              />
            </View>

            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>SAVE CHANGES</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF0DC" },
  gradient: { flex: 1, paddingHorizontal: 30, paddingTop: 60 },
  scrollContent: { paddingBottom: 40, alignItems: "center" },
  backButton: { marginBottom: 20 },
  backText: { color: "#550000", fontWeight: "700", letterSpacing: 1 },
  formContainer: { width: "100%", alignItems: "center" },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#550000",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 5,
  },
  subtitle: { color: "#550000", fontStyle: "italic", marginBottom: 30 },
  mainAvatarWrapper: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: "#550000",
    padding: 5,
    marginBottom: 30,
    backgroundColor: "#ffffff50",
    justifyContent: "center",
    alignItems: "center",
  },
  mainAvatar: { width: 140, height: 140, borderRadius: 70 },
  avatarListContainer: { width: "100%", marginBottom: 20 },
  flatListContent: { justifyContent: "center", alignItems: "center" },
  avatarOption: {
    margin: 10,
    padding: 5,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedAvatarOption: {
    borderColor: "#550000",
    backgroundColor: "#ffffff70",
  },
  avatarThumb: { width: 70, height: 70, borderRadius: 35 },
  saveButton: {
    backgroundColor: "#550000",
    paddingVertical: 14,
    borderRadius: 25,
    width: "100%",
    shadowColor: "#550000",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    marginTop: 10,
  },
  saveButtonText: {
    textAlign: "center",
    color: "#FAF0DC",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 1,
  },
});
