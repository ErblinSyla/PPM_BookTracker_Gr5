"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase/firebaseConfig";
import styles from "./styles/ProfileStyles";

import Spinner from "./components/Spinner";
import ProfileOption from "./components/ProfileOption";
import ConfirmModal from "./components/ConfirmModal";

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

export default function Profile() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [counts, setCounts] = useState({ reading: 0, toRead: 0, finished: 0 });
  const [avatarImage, setAvatarImage] = useState(
    require("../assets/avatars/avatar01.png")
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState({});

  const fetchProfileData = async (user) => {
    try {
      // Merr të dhënat nga Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();

        // Përdor avatarId nga Firestore, ose default 1
        const avatarId = data.avatarId || "1";
        setAvatarImage(AVATAR_MAP[avatarId]);

        // Ruaj avatarId lokalisht për përdorim të ardhshëm
        await AsyncStorage.setItem("userAvatarId", avatarId);

        setUserData({
          name:
            `${data.firstName || ""} ${data.lastName || ""}`.trim() || "User",
          email: data.email || user.email,
        });

        // Merr librat e përdoruesit
        const q = query(
          collection(db, "books"),
          where("userEmail", "==", data.email || user.email)
        );
        const snap = await getDocs(q);
        const books = snap.docs.map((d) => d.data());

        setCounts({
          reading: books.filter((b) => b.status === "reading").length,
          toRead: books.filter((b) => b.status === "to-read").length,
          finished: books.filter((b) => b.status === "finished").length,
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchProfileData(user);
      } else {
        router.replace("/Login");
      }
    });
    return () => unsubscribe();
  }, []);

  const performLogout = useCallback(async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("userAvatarId");
      router.replace("/Login");
    } catch (error) {
      console.error(error);
    }
  }, [router]);

  const showLogoutConfirmation = useCallback(() => {
    if (Platform.OS === "web") {
      setModalType("logout");
      setModalData({
        title: "Logout",
        message: "Are you sure you want to log out?",
      });
      setModalVisible(true);
    } else {
      Alert.alert("Logout", "Are you sure?", [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: performLogout },
      ]);
    }
  }, [performLogout]);

  const handleModalConfirm = useCallback(async () => {
    setModalVisible(false);
    if (modalType === "logout") await performLogout();
  }, [modalType, performLogout]);

  if (isLoading) return <Spinner />;

  return (
    <LinearGradient colors={["#FAF0DC", "#F2EBE2"]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push("/Homepage")}>
              <Text style={styles.backBtn}>←</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.flex__container}>
            <View style={styles.avatar}>
              <Image source={avatarImage} style={styles.avatar__image} />
              <Text style={styles.avatar__name}>{userData.name}</Text>
              <Text style={styles.avatar__email}>{userData.email}</Text>
            </View>

            <View style={styles.book__stats}>
              <View style={styles.book__active}>
                <Text style={styles.active__num}>{counts.reading}</Text>
                <Text style={styles.active__desc}>Reading</Text>
              </View>
              <View style={styles.book__pending}>
                <Text style={styles.pending__num}>{counts.toRead}</Text>
                <Text style={styles.pending__desc}>To Read</Text>
              </View>
              <View style={styles.book__completed}>
                <Text style={styles.completed__num}>{counts.finished}</Text>
                <Text style={styles.completed__desc}>Finished</Text>
              </View>
            </View>

            <View style={styles.profile__options}>
              <View style={styles.profile__options}>
                <ProfileOption
                  icon={require("../assets/profile_username-icon.png")}
                  title="Edit Profile"
                  desc="Edit your info"
                  onPress={() => router.push("/EditProfile")}
                />
                <ProfileOption
                  icon={require("../assets/profile_settings-icon.png")}
                  title="Settings"
                  desc="Notifications Center"
                  desc2="Change Password"
                  onPress={() => router.push("/Settings")}
                  end
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={showLogoutConfirmation}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <ConfirmModal
            visible={modalVisible}
            type={modalType}
            data={modalData}
            onCancel={() => setModalVisible(false)}
            onConfirm={handleModalConfirm}
          />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
