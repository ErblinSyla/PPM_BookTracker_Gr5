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
import { auth, db } from "../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
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


      // Shfaq modal
      setModalVisible(true);

      console.log("Verification email sent to:", userCredential.user.email);
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
    router.push("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up with Email</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Retype Password"
        secureTextEntry
        value={retypePassword}
        onChangeText={setRetypePassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {/* Modal për Verify Email */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleModalOk}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Verify your email</Text>
            <Text style={styles.modalMessage}>
              We’ve sent a verification link to your email address. Please
              verify before logging in.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleModalOk}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#FAF0DC",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#550000",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#55000060",
    borderRadius: 25,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#ffffff40",
    color: "#550000",
  },
  button: {
    backgroundColor: "#ffffff40",
    borderWidth: 1,
    borderColor: "#55000070",
    borderRadius: 25,
    paddingVertical: 15,
    marginBottom: 16,
  },
  buttonText: {
    textAlign: "center",
    color: "#550000",
    fontWeight: "600",
    fontSize: 16,
  },
  error: { color: "red", textAlign: "center", marginBottom: 10 },
  backText: { color: "#550000", marginTop: 20, textAlign: "center" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
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
    alignItems: "center",
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
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#550000",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  modalButtonText: {
    color: "#FAF0DC",
    fontWeight: "700",
    fontSize: 16,
  },
});
