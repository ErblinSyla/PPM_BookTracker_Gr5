"use client";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  Button,
} from "react-native";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { Alert, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";

import styles from "./styles/SettingsStyles";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

import NotificationService from "./services/NotificationService";
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
  const [notificationsEnabled, setNotificationEnabled] = useState(true);
  const [dailyReminderEnabled, setDailyReminderEnabled] = useState(true);
  const [weeklySummaryEnabled, setWeeklySummaryEnabled] = useState(true);
  const [readingStreakEnabled, setReadingStreakEnabled] = useState(true);
  const [bookAlmostFinishedEnabled, setBookAlmostFinishedEnabled] = useState(true);
  const [sessionCompletionEnabled, setSessionCompletionEnabled] = useState(true);
    

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

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

 const handleToggleNotification = async (enabled) => {
    if (enabled) {
      setNotificationEnabled(true);
    }else{
      setNotificationEnabled(false);
      await NotificationService.cancelAllNotifications();
      setDailyReminderEnabled(false);
      setWeeklySummaryEnabled(false);
      setReadingStreakEnabled(false);
      setBookAlmostFinishedEnabled(false);
      setSessionCompletionEnabled(false);
    }
 };

const handleToggleDailyReminder = async (enabled) => {
    if (!notificationsEnabled) return;
    setDailyReminderEnabled(enabled);
    if (!enabled) {
      await NotificationService.cancelDailyReminder();
    }
  };

  const handleToggleWeeklySummary = async (enabled) => {
    if (!notificationsEnabled) return;
    setWeeklySummaryEnabled(enabled);
    if (!enabled) {
      await NotificationService.cancelWeeklySummary();
    }
  };

  const handleToggleReadingStreak = async (enabled) => {
    if (!notificationsEnabled) return;
    setReadingStreakEnabled(enabled);
    if (!enabled) {
      await NotificationService.cancelReadingStreak();
    }
  };

  const handleToggleBookAlmostFinished = async (enabled) => {
    if (!notificationsEnabled) return;
    setBookAlmostFinishedEnabled(enabled);
    if (!enabled) {
      await NotificationService.cancelBookAlmostFinished();
    }
  };

  const handleToggleSessionCompletion = async (enabled) => {
    if (!notificationsEnabled) return;
    setSessionCompletionEnabled(enabled);
    if (!enabled) {
      await NotificationService.cancelSessionCompletion();
    }
  };




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
              <View style={styles.notificationContainer}>
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>Enable Notifications</Text>
                    <Text style={styles.settingDesc}>Turn on/off all notifications</Text>
                  </View>
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={handleToggleNotification}
                    trackColor={{ false: "#E6D9B8", true: "#550000" }}
                    thumbColor={notificationsEnabled ? "#FAF0DC" : "#550000"}
                    ios_backgroundColor="#E6D9B8"
                  />
                </View>
                <View style={styles.notificationSubItem}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingSubTitle}>Daily Reminder</Text>
                  </View>
                  <Switch
                    value={dailyReminderEnabled}
                    onValueChange={handleToggleDailyReminder}
                    trackColor={{ false: "#E6D9B8", true: "#550000" }}
                    thumbColor={dailyReminderEnabled ? "#FAF0DC" : "#550000"}
                    ios_backgroundColor="#E6D9B8"
                    disabled={!notificationsEnabled}
                  />
                </View>
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
                    editable={!isLoading}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholderTextColor="rgba(85, 0, 0, 0.5)"
                    editable={!isLoading}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Retype New Password"
                    secureTextEntry
                    value={retypePassword}
                    onChangeText={setRetypePassword}
                    placeholderTextColor="rgba(85, 0, 0, 0.5)"
                    editable={!isLoading}
                  />

                  {passwordError ? (
                    <Text style={styles.errorText}>{passwordError}</Text>
                  ) : null}
                  {passwordSuccess ? (
                    <Text style={styles.successText}>{passwordSuccess}</Text>
                  ) : null}

                  <TouchableOpacity
                    style={[
                      styles.saveButton,
                      isLoading && styles.saveButtonDisabled,
                    ]}
                    onPress={handleChangePassword}
                    disabled={isLoading}
                  >
                    <Text style={styles.saveButtonText}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Text>
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
