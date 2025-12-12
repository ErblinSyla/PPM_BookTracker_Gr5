import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: `${firstName} ${lastName}` });
      await AsyncStorage.setItem("userUID", userCredential.user.uid);
      await sendEmailVerification(userCredential.user);
