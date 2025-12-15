"use client";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  Platform,
  Modal,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserData } from "../app/services/authService";
import { collection, query, where, getDocs } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase/firebaseConfig";
import styles from "./styles/ProfileStyles";

export default function Profile() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(null);

  const [counts, setCounts] = useState({
    reading: 0,
    toRead: 0,
    finished: 0,
  });

  const [userData, setUserData] = useState({ name: "", email: "" });
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

  useEffect(() => {
    const loadUser = async () => {
      const uid = await AsyncStorage.getItem("userUID");
      if (!uid) return;

      const data = await getUserData(uid);
      if (!data) return;

      setUserData(data);

      const q = query(
        collection(db, "books"),
        where("userEmail", "==", data.email)
      );

      const snap = await getDocs(q);
      const books = snap.docs.map((d) => d.data());

      setCounts({
        reading: books.filter((b) => b.status === "reading").length,
        toRead: books.filter((b) => b.status === "to-read").length,
        finished: books.filter((b) => b.status === "finished").length,
      });
    };

    loadUser();
  }, []);

 
  const bookCounts = useMemo(() => ({
    reading: counts.reading,
    toRead: counts.toRead,
    finished: counts.finished,
  }), [counts]);


  const performLogout = useCallback(async () => {
    await signOut(auth);
    router.replace("/");
  }, [router]);

  const showLogoutConfirmation = useCallback(() => {
    if (Platform.OS === "web") {
      setModalType("logout");
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

  const renderModal = useCallback(() => (
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
  ), [modalVisible, modalType, modalData.title, handleModalConfirm]);

  return (
    <LinearGradient
      colors={["#FAF0DC", "#F2EBE2"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />

        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push("/homepage")}>
              <Text style={styles.backBtn}>←</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.flex__container}>
            <View style={styles.avatar}>
              <Image
                source={require("../assets/profile-image-test.png")}
                style={styles.avatar__image}
              />
              <Text style={styles.avatar__name}>{userData.name}</Text>
              <Text style={styles.avatar__email}>{userData.email}</Text>
            </View>

            <View style={styles.book__stats}>
              <TouchableOpacity
                onPress={() => router.push("/homepage")}
                style={styles.book__active}
              >
                <Text style={styles.active__num}>{bookCounts.reading}</Text>
                <Text style={styles.active__desc}>Reading</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/homepage")}
                style={styles.book__pending}
              >
                <Text style={styles.pending__num}>{bookCounts.toRead}</Text>
                <Text style={styles.pending__desc}>To Read</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/homepage")}
                style={styles.book__completed}
              >
                <Text style={styles.completed__num}>{bookCounts.finished}</Text>
                <Text style={styles.completed__desc}>Finished</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.profile__options}>
              <TouchableOpacity style={[styles.profile__option, styles.profile__option__user]}>
                <View style={styles.option__icon}>
                  <Image
                    source={require("../assets/profile_username-icon.png")}
                    style={styles.option__image}
                  />
                  <View style={styles.option__info}>
                    <Text style={styles.info__title}>Username</Text>
                    <Text style={styles.info__desc}>
                      @{userData.name?.toLowerCase().replace(/ /g, "_")}
                    </Text>
                  </View>
                </View>

                <View style={styles.option__nav}>
                  <Image
                    source={require("../assets/profile_arrow-right-icon.png")}
                    style={styles.nav__arrow}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.profile__option}>
                <View style={styles.option__icon}>
                  <Image
                    source={require("../assets/profile_notification-icon.png")}
                    style={styles.option__image}
                  />
                  <View style={styles.option__info}>
                    <Text style={styles.info__title}>Notifications</Text>
                    <Text style={styles.info__desc}>Mute, Push, Email</Text>
                  </View>
                </View>

                <View style={styles.option__nav}>
                  <Image
                    source={require("../assets/profile_arrow-right-icon.png")}
                    style={styles.nav__arrow}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/settings")}
                style={[styles.profile__option, styles.profile__option__end]}
              >
                <View style={styles.option__icon}>
                  <Image
                    source={require("../assets/profile_settings-icon.png")}
                    style={styles.option__image}
                  />
                  <View style={styles.option__info}>
                    <Text style={styles.info__title}>Settings</Text>
                    <Text style={styles.info__desc}>Security, Privacy</Text>
                  </View>
                </View>

                <View style={styles.option__nav}>
                  <Image
                    source={require("../assets/profile_arrow-right-icon.png")}
                    style={styles.nav__arrow}
                  />
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={showLogoutConfirmation}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
          {renderModal()}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
