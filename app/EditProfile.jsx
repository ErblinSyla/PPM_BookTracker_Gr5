"use client";

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import styles from "./styles/EditProfileStyles";

const AVATAR_MAP = {
  1: require("../assets/avatars/avatar01.png"),
  2: require("../assets/avatars/avatar02.png"),
  3: require("../assets/avatars/avatar03.png"),
  4: require("../assets/avatars/avatar04.png"),
  5: require("../assets/avatars/avatar05.png"),
  6: require("../assets/avatars/avatar06.png"),
  7: require("../assets/avatars/avatar07.png"),
  8: require("../assets/avatars/avatar08.png"),
  9: require("../assets/avatars/avatar09.png"),
  10: require("../assets/avatars/avatar10.png"),
  11: require("../assets/avatars/avatar11.png"),
  12: require("../assets/avatars/avatar12.png"),
  13: require("../assets/avatars/avatar13.png"),
  14: require("../assets/avatars/avatar14.png"),
  15: require("../assets/avatars/avatar15.png"),
};

export default function EditProfile() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(10)).current;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatarId, setAvatarId] = useState("1");
  const [avatar, setAvatar] = useState(AVATAR_MAP["1"]);

  const [userEmail, setUserEmail] = useState(null);
  const [providerId, setProviderId] = useState("");
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
        setProviderId(user.providerData[0]?.providerId || "");
        setIsLoadingAuth(false);
      } else {
        setUserEmail(null);
        setProviderId("");
        setIsLoadingAuth(false);
        router.replace("/Login");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const user = auth.currentUser;
          if (!user) return;

          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            setFirstName(data.firstName || "");
            setLastName(data.lastName || "");

            const savedAvatarId = await AsyncStorage.getItem("userAvatarId");
            const idToUse = savedAvatarId || data.avatarId || "1";
            setAvatarId(idToUse);
            setAvatar(AVATAR_MAP[idToUse]);
          }
        } catch (e) {
          console.log("Load error:", e);
        }
      };

      loadData();
    }, [])
  );

  const handleSave = useCallback(async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "User not found.");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        avatarId,
      });

      await AsyncStorage.setItem("userAvatarId", avatarId);
      Alert.alert("Success", "Profile updated!");
      router.push("/Profile");
    } catch (e) {
      console.log("Save error:", e);
      Alert.alert("Error", "Failed to save profile. Try again.");
    }
  }, [firstName, lastName, avatarId]);

  if (isLoadingAuth) return null;

  return (
    <LinearGradient colors={["#FAF0DC", "#F2EBE2"]} style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>      ←</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            marginTop: 50,
            alignItems: "center",
          }}
        >
          <View style={styles.avatarSection}>
            <Image source={avatar} style={styles.avatar} />
            <TouchableOpacity onPress={() => router.push("/EditAvatar")}>
              <Text style={styles.editAvatarText}>Edit avatar</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First Name"
            placeholderTextColor="#55000070"
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last Name"
            placeholderTextColor="#55000070"
          />

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}
