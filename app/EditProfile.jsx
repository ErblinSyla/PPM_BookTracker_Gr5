"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  StyleSheet,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const AVATAR_MAP = {
  "1": require("../assets/avatars/avatar01.png"),
  "2": require("../assets/avatars/avatar02.png"),
  "3": require("../assets/avatars/avatar03.png"),
  "4": require("../assets/avatars/avatar04.png"),
  "5": require("../assets/avatars/avatar05.png"),
  "6": require("../assets/avatars/avatar06.png"),
  "7": require("../assets/avatars/avatar07.png"),
  "8": require("../assets/avatars/avatar08.png"),
  "9": require("../assets/avatars/avatar09.png"),
  "10": require("../assets/avatars/avatar10.png"),
  "11": require("../assets/avatars/avatar11.png"),
  "12": require("../assets/avatars/avatar12.png"),
  "13": require("../assets/avatars/avatar13.png"),
  "14": require("../assets/avatars/avatar14.png"),
  "15": require("../assets/avatars/avatar15.png"),
};

export default function EditProfile() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(10)).current;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("Prefer not to say");
  const [showGenderOptions, setShowGenderOptions] = useState(false);
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
      Animated.timing(fadeAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
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
            setBio(data.bio || "");
            setGender(data.gender || "Prefer not to say");

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

  const handleSave = async () => {
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
        bio,
        gender,
        avatarId,
      });

      await AsyncStorage.setItem("userAvatarId", avatarId);
      Alert.alert("Success", "Profile updated!");
      router.push("/profile");
    } catch (e) {
      console.log("Save error:", e);
      Alert.alert("Error", "Failed to save profile. Try again.");
    }
  };

  if (isLoadingAuth) {
    return null; 
  }

  return (
    <LinearGradient colors={["#FAF0DC", "#F2EBE2"]} style={styles.container}>
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

          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            value={bio}
            onChangeText={setBio}
            multiline
            maxLength={150}
            placeholder="Bio"
            placeholderTextColor="#55000070"
          />
          <Text style={styles.charCount}>{bio.length} / 150</Text>

          <Text style={styles.label}>Gender</Text>
          <TouchableOpacity
            style={styles.genderBox}
            onPress={() => setShowGenderOptions(!showGenderOptions)}
          >
            <Text style={styles.genderText}>{gender}</Text>
            <Text style={[styles.arrow, showGenderOptions && styles.arrowOpen]}>▼</Text>
          </TouchableOpacity>

          {showGenderOptions && (
            <View style={styles.genderOptions}>
              {["Prefer not to say", "Male", "Female"].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.genderOption}
                  onPress={() => {
                    setGender(option);
                    setShowGenderOptions(false);
                  }}
                >
                  <Text style={styles.genderOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, alignItems: "center" },
  avatarSection: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#ffffff30",
    padding: 15,
    borderRadius: 20,
    elevation: 5,
  },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  editAvatarText: { color: "#550000", fontWeight: "600", fontSize: 16 },
  label: { alignSelf: "flex-start", color: "#550000", fontWeight: "600", marginBottom: 5, marginTop: 15 },
  input: {
    width: 300,
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#ffffff20",
    color: "#550000",
    borderWidth: 1,
    borderColor: "#55000050",
    marginBottom: 15,
  },
  charCount: { alignSelf: "flex-end", color: "#550000", marginBottom: 15 },
  genderBox: {
    width: 300,
    borderRadius: 12,
    backgroundColor: "#ffffff30",
    padding: 14,
    borderWidth: 1,
    borderColor: "#55000050",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  genderText: { color: "#550000", fontWeight: "500" },
  arrow: { color: "#550000", fontSize: 18 },
  arrowOpen: { transform: [{ rotate: "180deg" }] },
  genderOptions: {
    width: 300,
    backgroundColor: "#ffffff50",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 30,
    elevation: 3,
  },
  genderOption: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#55000030" },
  genderOptionText: { color: "#550000", fontWeight: "500" },
  saveBtn: {
    backgroundColor: "#550000",
    paddingVertical: 14,
    borderRadius: 25,
    width: 300,
    alignItems: "center",
    marginBottom: 40,
  },
  saveText: { color: "#FAF0DC", fontWeight: "700", fontSize: 16 },
});
