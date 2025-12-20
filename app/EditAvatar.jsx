import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db, auth } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

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

export default function EditAvatar() {
  const router = useRouter();
  const [selectedAvatarId, setSelectedAvatarId] = useState("1");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].image);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login"); 
      }
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();

    const loadAvatar = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          const idToUse = (await AsyncStorage.getItem("userAvatarId")) || data.avatarId || "1";
          setSelectedAvatarId(idToUse);
          const avatarObj = AVATARS.find(a => a.id === idToUse);
          setSelectedAvatar(avatarObj ? avatarObj.image : AVATARS[0].image);
        }
      } catch (error) {
        console.error("Failed to load avatar", error);
      }
    };
    loadAvatar();
  }, []);

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "You must be logged in.");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { avatarId: selectedAvatarId });
      await AsyncStorage.setItem("userAvatarId", selectedAvatarId);

      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save avatar.");
    }
  };

  if (isLoadingAuth) return null;

  if (!selectedAvatar) return null;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <LinearGradient colors={["#FAF0DC", "#F2EBE2"]} style={styles.gradient}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>← BACK</Text>
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Animated.View
              style={[styles.formContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
            >
              <Text style={styles.title}>Edit Avatar</Text>

              <View style={styles.mainAvatarWrapper}>
                <Image source={selectedAvatar} style={styles.mainAvatar} />
              </View>

              <FlatList
                data={AVATARS}
                keyExtractor={(item) => item.id}
                numColumns={3}
                scrollEnabled={false}
                contentContainerStyle={styles.flatListContent}
                renderItem={({ item }) => {
                  const isSelected = selectedAvatarId === item.id;
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedAvatarId(item.id);
                        setSelectedAvatar(item.image);
                      }}
                      style={[styles.avatarOption, isSelected && styles.selectedAvatarOption]}
                    >
                      <Image source={item.image} style={styles.avatarThumb} />
                    </TouchableOpacity>
                  );
                }}
              />

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>SAVE CHANGES</Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF0DC" },
  gradient: { flex: 1, paddingHorizontal: 30 },
  backButton: { marginTop: 10, marginBottom: 20 },
  backText: { color: "#550000", fontWeight: "700", letterSpacing: 1 },
  scrollContent: { paddingBottom: 40, alignItems: "center" },
  formContainer: { width: "100%", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "800", color: "#550000", marginBottom: 30 },
  mainAvatarWrapper: { width: 150, height: 150, borderRadius: 75, borderWidth: 3, borderColor: "#550000", padding: 5, marginBottom: 30, justifyContent: "center", alignItems: "center" },
  mainAvatar: { width: 140, height: 140, borderRadius: 70 },
  flatListContent: { alignItems: "center" },
  avatarOption: { margin: 10, padding: 5, borderRadius: 40, borderWidth: 2, borderColor: "transparent" },
  selectedAvatarOption: { borderColor: "#550000", backgroundColor: "#ffffff60" },
  avatarThumb: { width: 70, height: 70, borderRadius: 35 },
  saveButton: { backgroundColor: "#550000", paddingVertical: 14, borderRadius: 25, width: "100%", marginTop: 20, elevation: 8 },
  saveButtonText: { textAlign: "center", color: "#FAF0DC", fontWeight: "700", fontSize: 16, letterSpacing: 1 },
});
