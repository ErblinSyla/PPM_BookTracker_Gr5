import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

import SignupEmailStyles from "./styles/SignupEmailStyles"; 

export default function SignupEmail() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleSignup = async () => {
    setError("");
    if (!firstName || !lastName || !email || !password || !retypePassword) {
      setError("Please fill all fields!");
      return;
    }
    if (password !== retypePassword) {
      setError("Passwords do not match!");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`,
      });
      await AsyncStorage.setItem("userUID", userCredential.user.uid);
      await sendEmailVerification(userCredential.user);

      await setDoc(doc(db, "users", userCredential.user.uid), {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase(),
        bio: "",
        gender: "Prefer not to say",
        avatarId: "1",
        createdAt: new Date().toISOString(),
      });

      setModalVisible(true);
    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use")
        setError("Email is already in use!");
      else if (err.code === "auth/invalid-email")
        setError("Invalid email address!");
      else setError("Something went wrong. Please try again!");
    }
  };

  const handleModalOk = () => {
    setModalVisible(false);
    router.push("/Login");
  };

  const goBack = () => {
    router.back();
  };

  return (
    <View style={SignupEmailStyles.container}>
      <View style={SignupEmailStyles.gradient}>
        <View style={SignupEmailStyles.formContainer}>
          <Text style={SignupEmailStyles.title}>Sign Up</Text>
          <Text style={SignupEmailStyles.subtitle}>
            Create your account with email
          </Text>

          <TextInput
            style={SignupEmailStyles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            placeholderTextColor="#55000080"
          />
          <TextInput
            style={SignupEmailStyles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            placeholderTextColor="#55000080"
          />
          <TextInput
            style={SignupEmailStyles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#55000080"
          />
          <TextInput
            style={SignupEmailStyles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#55000080"
          />
          <TextInput
            style={SignupEmailStyles.input}
            placeholder="Retype Password"
            secureTextEntry
            value={retypePassword}
            onChangeText={setRetypePassword}
            placeholderTextColor="#55000080"
          />

          {error ? <Text style={SignupEmailStyles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={SignupEmailStyles.signupButton} onPress={handleSignup}>
            <Text style={SignupEmailStyles.signupButtonText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={goBack} style={SignupEmailStyles.backButtonContainer}>
            <Text style={SignupEmailStyles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={SignupEmailStyles.modalOverlay}>
          <View style={SignupEmailStyles.modalContent}>
            <Text style={SignupEmailStyles.modalTitle}>Verify your email</Text>
            <Text style={SignupEmailStyles.modalMessage}>
              We’ve sent a verification link to your email address. Please verify before logging in.
            </Text>
            <TouchableOpacity style={SignupEmailStyles.modalButton} onPress={handleModalOk}>
              <Text style={SignupEmailStyles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}