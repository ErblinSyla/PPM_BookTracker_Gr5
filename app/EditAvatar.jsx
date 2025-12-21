"use client";

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
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
import styles from "./styles/EditAvatarStyles";

const AVATARS = [
  { id: "1", image: require("../assets/avatars/avatar01.png") },
  { id: "2", image: require("../assets/avatars/avatar02.png") },
  { id: "3", image: require("../assets/avatars/avatar03.png") },
  { id: "4", image: require("../assets/avatars/avatar04.png") },
  { id: "5", image: require("../assets/avatars/avatar05.png") },
  { id: "6", image: require("../assets/avatars/avatar06.png") },
  { id: "7", image: require("../assets/avatars/avatar07.png") },
  { id: "8", image: require("../assets/avatars/avatar08.png") },
  { id: "9", image: require("../assets/avatars/avatar09.png") },
  { id: "10", image: require("../assets/avatars/avatar10.png") },
  { id: "11", image: require("../assets/avatars/avatar11.png") },
  { id: "12", image: require("../assets/avatars/avatar12.png") },
  { id: "13", image: require("../assets/avatars/avatar13.png") },
  { id: "14", image: require("../assets/avatars/avatar14.png") },
  { id: "15", image: require("../assets/avatars/avatar15.png") },
];

const AvatarOption = React.memo(({ item, isSelected, onSelect }) => (
  <TouchableOpacity
    onPress={() => onSelect(item)}
    style={[styles.avatarOption, isSelected && styles.selectedAvatarOption]}
  >
    <Image source={item.image} style={styles.avatarThumb} />
  </TouchableOpacity>
));

export default function EditAvatar() {
  const router = useRouter();
  const [selectedAvatarId, setSelectedAvatarId] = useState("1");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].image);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.replace("/Login");
      setIsLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();

    const loadAvatar = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          const idToUse =
            (await AsyncStorage.getItem("userAvatarId")) ||
            data.avatarId ||
            "1";
          setSelectedAvatarId(idToUse);
          const avatarObj = AVATARS.find((a) => a.id === idToUse);
          setSelectedAvatar(avatarObj ? avatarObj.image : AVATARS[0].image);
        }
      } catch (error) {
        console.error("Failed to load avatar", error);
      }
    };
    loadAvatar();
  }, []);

  const handleSelectAvatar = useCallback((item) => {
    setSelectedAvatarId(item.id);
    setSelectedAvatar(item.image);
  }, []);

  const handleSave = useCallback(async () => {
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
  }, [selectedAvatarId]);

  const avatarsData = useMemo(() => AVATARS, []);

  if (isLoadingAuth) return null;
  if (!selectedAvatar) return null;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <LinearGradient colors={["#FAF0DC", "#F2EBE2"]} style={styles.gradient}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Animated.View
              style={[
                styles.formContainer,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}
            >
              <Text style={styles.title}>Edit Avatar</Text>

              <View style={styles.mainAvatarWrapper}>
                <Image source={selectedAvatar} style={styles.mainAvatar} />
              </View>

              <FlatList
                data={avatarsData}
                keyExtractor={(item) => item.id}
                numColumns={3}
                scrollEnabled={false}
                contentContainerStyle={styles.flatListContent}
                renderItem={({ item }) => (
                  <AvatarOption
                    item={item}
                    isSelected={selectedAvatarId === item.id}
                    onSelect={handleSelectAvatar}
                  />
                )}
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
