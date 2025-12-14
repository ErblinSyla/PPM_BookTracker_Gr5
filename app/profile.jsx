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
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserData } from "../app/services/authService";
import { collection, query, where, getDocs } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase/firebaseConfig";

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

  const performLogout = async () => {
    await signOut(auth);
    router.replace("/");
  };

  const handleModalConfirm = async () => {
    setModalVisible(false);
    if (modalType === "logout") await performLogout();
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
                <Text style={styles.active__num}>{counts.reading}</Text>
                <Text style={styles.active__desc}>Reading</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/homepage")}
                style={styles.book__pending}
              >
                <Text style={styles.pending__num}>{counts.toRead}</Text>
                <Text style={styles.pending__desc}>To Read</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/homepage")}
                style={styles.book__completed}
              >
                <Text style={styles.completed__num}>{counts.finished}</Text>
                <Text style={styles.completed__desc}>Finished</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.profile__options}>
              <TouchableOpacity style={styles.profile__option}>
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

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FAF0DC",
  },
  container: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  header: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backBtn: {
    color: "#550000",
    fontSize: 26,
    fontWeight: "700",
  },
  flex__container: {
    flexDirection: "column",
    alignItems: "center",
    gap: 30,
    marginTop: 30,
  },
  avatar: {
    flexDirection: "column",
    alignItems: "center",
    gap: 5,
  },
  avatar__image: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  avatar__name: {
    color: "#550000",
    fontSize: 26,
    fontWeight: "700",
  },
  avatar__email: {
    color: "#550000",
    fontSize: 16,
    fontWeight: "500",
    opacity: 0.6,
  },
  book__stats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  book__active: {
    width: 90,
    height: 110,
    backgroundColor: "#550000",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  active__num: {
    fontSize: 28,
    color: "#FAF0DC",
    fontWeight: "700",
  },
  active__desc: {
    fontSize: 16,
    color: "#FAF0DC",
    fontWeight: "500",
  },
  book__pending: {
    width: 90,
    height: 110,
    backgroundColor: "#E6D9B8",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  pending__num: {
    fontSize: 28,
    color: "#550000",
    fontWeight: "700",
  },
  pending__desc: {
    fontSize: 16,
    color: "#550000",
    fontWeight: "500",
  },
  book__completed: {
    width: 90,
    height: 110,
    backgroundColor: "#E6D9B8",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  completed__num: {
    fontSize: 28,
    color: "#550000",
    fontWeight: "700",
  },
  completed__desc: {
    fontSize: 16,
    color: "#550000",
    fontWeight: "500",
  },
  profile__options: {
    width: 305,
    height: 275,
    borderRadius: 20,
    padding: 15,
    backgroundColor: "#FCF7E6",
    justifyContent: "space-around",
  },
  profile__option: {
    flexDirection: "row",
    gap: 75,
    alignItems: "center",
    paddingBottom: 15,
    paddingTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(85,0,0,0.1)",
  },
  profile__option__end: {
    borderBottomWidth: 0,
  },
  option__icon: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
  option__image: {
    width: 32,
    height: 32,
  },
  option__info: {
    flexDirection: "column",
  },
  info__title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#550000",
  },
  info__desc: {
    fontSize: 14,
    opacity: 0.6,
    color: "#550000",
  },
  option__nav: {},
  nav__arrow: {
    width: 18,
    height: 18,
  },
  logoutBtn: {
    marginTop: 20,
    backgroundColor: "#550000",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  logoutText: {
    color: "#FAF0DC",
    fontSize: 18,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#550000",
    marginBottom: 12,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 16,
    color: "#550000",
    marginBottom: 24,
    lineHeight: 22,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 100,
    alignItems: "center",
  },
  cancelButton: { backgroundColor: "#f0f0f0" },
  confirmButton: { backgroundColor: "#ff4444" },
  cancelButtonText: { color: "#550000", fontWeight: "600", fontSize: 16 },
  confirmButtonText: { color: "white", fontWeight: "600", fontSize: 16 },
});
