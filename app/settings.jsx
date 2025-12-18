"use client";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
} from "react-native";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { Alert, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";

import styles from "./styles/SettingsStyles";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

import Spinner from "./components/Spinner";

export default function Settings() {
  const router = useRouter();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [userEmail, setUserEmail] = useState(null);
  const [providerId, setProviderId] = useState("");
  const [readingReminder, setReadingReminder] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

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
        router.replace("/login");
        setIsLoadingAuth(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");
    setIsLoading(true);

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      setIsLoading(false);
      return;
    }

    if (!newPassword) {
      setPasswordError("Please enter a new password.");
      setIsLoading(false);
      return;
    }

    const strongPasswordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (!strongPasswordRegex.test(newPassword)) {
      setPasswordError(
        "New password must be at least 8 characters long and include at least 1 number and 1 special character (!@#$%^&* etc.)."
      );
      setIsLoading(false);
      return;
    }

    if (newPassword !== retypePassword) {
      setPasswordError("New passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError("New password must be different from current.");
      setIsLoading(false);
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        setPasswordError("No user logged in.");
        setIsLoading(false);
        return;
      }

      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);

      setPasswordSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setRetypePassword("");

      if (Platform.OS !== "web") {
        Alert.alert("Success", "Your password has been updated!");
      }
    } catch (error) {
      console.error("Password change error:", error);

      if (error.code === "auth/wrong-password") {
        setPasswordError("Current password is incorrect.");
      } else if (error.code === "auth/too-many-requests") {
        setPasswordError("Too many attempts. Try again later.");
      } else if (error.code === "auth/requires-recent-login") {
        setPasswordError("Please log in again to change your password.");
      } else {
        setPasswordError("Failed to change password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingAuth) return <Spinner />;

  return (
    <LinearGradient
      colors={["#FAF0DC", "#F2EBE2"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <SafeAreaView style={styles.safe}>
          <StatusBar style="light" />

          <ScrollView contentContainerStyle={styles.scroll}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.push("/profile")}>
                <Text style={styles.backBtn}>←</Text>
              </TouchableOpacity>
              <Text style={styles.pageTitle}>Settings</Text>
              <View style={{ width: 30 }} />
            </View>

            <View style={styles.contentContainer}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Dark Mode</Text>
                  <Text style={styles.settingDesc}>Switch to dark theme</Text>
                </View>
                <Switch
                  value={isDarkMode}
                  onValueChange={toggleDarkMode}
                  trackColor={{ false: "#E6D9B8", true: "#550000" }}
                  thumbColor={isDarkMode ? "#FAF0DC" : "#550000"}
                  ios_backgroundColor="#E6D9B8"
                />
              </View>

              {providerId === "password" && (
                <View style={styles.passwordSection}>
                  <Text style={styles.sectionTitle}>Change Password</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Current Password"
                    secureTextEntry
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholderTextColor="rgba(85, 0, 0, 0.5)"
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholderTextColor="rgba(85, 0, 0, 0.5)"
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Retype New Password"
                    secureTextEntry
                    value={retypePassword}
                    onChangeText={setRetypePassword}
                    placeholderTextColor="rgba(85, 0, 0, 0.5)"
                  />

                  <TouchableOpacity style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              )}
              <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>App Version</Text>
                  <Text style={styles.infoValue}>1.0.0</Text>
                </View>

                <Text style={styles.copyright}>
                  © 2025 BookTracker. All rights reserved.
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </LinearGradient>
  );
}
