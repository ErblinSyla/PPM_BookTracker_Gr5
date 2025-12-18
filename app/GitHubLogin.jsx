import React, { useEffect, useCallback, useState, memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import {
  GithubAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { useRouter } from "expo-router";
import { doc, setDoc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

function GitHubLogin() {
  const router = useRouter();
  const isWeb = Platform.OS === "web";
  const [loading, setLoading] = useState(false);

  // Memoized function to save user data
  const saveUserData = useCallback(async (user) => {
    try {
      await AsyncStorage.setItem("userUID", user.uid);

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName || "GitHub User",
          email: user.email || "",
          photoURL: user.photoURL || "",
          createdAt: new Date().toISOString(),
          provider: "github",
        });
      }
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await saveUserData(user);
        router.replace("/homepage");
      }
    });

    return () => unsubscribe();
  }, [router, saveUserData]);

  // Handle redirect result on mobile
  useEffect(() => {
    if (!isWeb) {
      getRedirectResult(auth)
        .then(async (result) => {
          if (result?.user) {
            await saveUserData(result.user);
            Alert.alert("Sukses!", `Mirë se erdhe ${result.user.displayName || "përdorues"}!`);
            router.replace("/homepage");
          }
        })
        .catch((error) => {
          if (error.code !== "auth/no-credential") {
            console.error("Redirect result error:", error);
            Alert.alert("Gabim", "Diçka shkoi keq me login-in.");
          }
        });
    }
  }, [isWeb, saveUserData]);

  // Memoized GitHub sign-in handler
  const signInWithGitHub = useCallback(async () => {
    setLoading(true);
    try {
      const provider = new GithubAuthProvider();
      provider.addScope("read:user user:email");

      if (isWeb) {
        const result = await signInWithPopup(auth, provider);
        if (result.user) {
          await saveUserData(result.user);
          Alert.alert("Sukses!", `Mirë se erdhe ${result.user.displayName || "përdorues"}!`);
          router.replace("/homepage");
        }
      } else {
        await signInWithRedirect(auth, provider);
      }
    } catch (error) {
      console.error("GitHub login error:", error);
      let message = "Login me GitHub dështoi. Provo përsëri.";
      if (
        error.code === "auth/popup-closed-by-user" ||
        error.code === "auth/cancelled-popup-request"
      ) {
        message = "Login u anulua nga përdoruesi.";
      }
      Alert.alert("Gabim", message);
    } finally {
      setLoading(false);
    }
  }, [isWeb, saveUserData]);

  // Memoized back handler
  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Continue with GitHub</Text>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={signInWithGitHub}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#550000" size="small" />
          ) : (
            <Text style={styles.buttonText}>Sign in with GitHub</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleGoBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF0DC",
    justifyContent: "center",
    alignItems: "center",
  },
  contentWrapper: {
    width: "100%",
    maxWidth: 440,
    paddingHorizontal: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#550000",
    marginBottom: 40,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#ffffff40",
    borderWidth: 1,
    borderColor: "#55000070",
    borderRadius: 25,
    paddingVertical: 16,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#550000",
    fontWeight: "600",
    fontSize: 16,
  },
  backText: {
    marginTop: 32,
    color: "#550000",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default memo(GitHubLogin);