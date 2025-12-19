import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";

export default function EditProfile() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  const [username, setUsername] = useState("eraberishaaaa");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("Prefer not to say");

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

  return (
    <LinearGradient colors={["#FAF0DC", "#F2EBE2"]} style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
          {/* Avatar + Edit Avatar */}
          <View style={styles.avatarSection}>
            <Image
              source={require("../assets/avatar01.png")}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Text style={styles.editAvatarText}>Edit avatar</Text>
            </TouchableOpacity>
          </View>

          {/* Username */}
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            placeholderTextColor="#55000070"
          />

          {/* Bio */}
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

          {/* Gender */}
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderBox}>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
              style={styles.genderPicker}
              dropdownIconColor="#550000"
            >
              <Picker.Item label="Prefer not to say" value="Prefer not to say" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>

          {/* Save Changes */}
          <TouchableOpacity style={styles.saveBtn}>
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    padding: 20,
    alignItems: "center",
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#ffffff30",
    padding: 15,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  editAvatarBtn: {
    // Thjesht touchable
  },
  editAvatarText: {
    color: "#550000",
    fontWeight: "600",
    fontSize: 16,
  },
  label: {
    alignSelf: "flex-start",
    color: "#550000",
    fontWeight: "600",
    marginBottom: 5,
    marginTop: 15,
  },
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
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#55000050",
    backgroundColor: "#ffffff20",
    justifyContent: "center",
    marginBottom: 30,
  },
  genderPicker: {
    color: "#550000",
    backgroundColor: "transparent",
    width: "100%",
    height: "100%",
  },
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
