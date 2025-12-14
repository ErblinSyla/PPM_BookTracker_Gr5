"use client";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";

export default function Settings() {
  const router = useRouter();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

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
            {/* Header with Back Button */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.push("/profile")}>
                <Text style={styles.backBtn}>←</Text>
              </TouchableOpacity>
              <Text style={styles.pageTitle}>Settings</Text>
              <View style={{ width: 30 }} /> {/* Spacer for centering title */}
            </View>

            <View style={styles.contentContainer}>
              {/* Dark Mode Toggle */}
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

              {/* Change Password Section */}
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

                <TouchableOpacity style={styles.saveButton} disabled>
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </LinearGradient>
  );
}
