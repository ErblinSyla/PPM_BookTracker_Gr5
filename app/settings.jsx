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

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

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
