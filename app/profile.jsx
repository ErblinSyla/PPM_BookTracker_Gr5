"use client";

import {
  View,
  Text,
  TouchableOpacity,
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

import Spinner from "./components/Spinner";

const ProfileOption = React.memo(function ProfileOption({
  icon,
  title,
  desc,
  onPress,
  end = false,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.profile__option,
        end && styles.profile__option__end,
      ]}
    >
      <View style={styles.option__icon}>
        <Image source={icon} style={styles.option__image} />
        <View style={styles.option__info}>
          <Text style={styles.info__title}>{title}</Text>
          <Text style={styles.info__desc}>{desc}</Text>
        </View>
      </View>

      <View style={styles.option__nav}>
        <Image
          source={require("../assets/profile_arrow-right-icon.png")}
          style={styles.nav__arrow}
        />
      </View>
    </TouchableOpacity>
  );
});

const ConfirmModal = React.memo(function ConfirmModal({
  visible,
  type,
  data,
  onCancel,
  onConfirm,
}) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {type === "logout" ? "Logout" : "Delete Book"}
          </Text>
          <Text style={styles.modalMessage}>
            {type === "logout"
              ? "Are you sure you want to logout?"
              : `Delete "${data.title || "this book"}"?`}
          </Text>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmButtonText}>
                {type === "logout" ? "Logout" : "Delete"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
});



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
  const [isLoading, setIsLoading] = useState(true);

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
      try {
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
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const bookCounts = useMemo(
    () => ({
      reading: counts.reading,
      toRead: counts.toRead,
      finished: counts.finished,
    }),
    [counts]
  );

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

  if (isLoading) {
    return <Spinner />;
  }

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
              <ProfileOption
                icon={require("../assets/profile_username-icon.png")}
                title="Username"
                desc={`@${userData.name?.toLowerCase().replace(/ /g, "_")}`}
              />

              <ProfileOption
                icon={require("../assets/profile_notification-icon.png")}
                title="Notifications"
                desc="Mute, Push, Email"
              />

              <ProfileOption
                icon={require("../assets/profile_settings-icon.png")}
                title="Settings"
                desc="Security, Privacy"
                onPress={() => router.push("/settings")}
                end
              />
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
