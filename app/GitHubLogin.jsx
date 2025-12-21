import React, { useEffect, useCallback } from "react";
import { View, Platform, Alert, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import {
  GithubAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GitHubLoginStyles from "./styles/GitHubLoginStyles";

WebBrowser.maybeCompleteAuthSession();

// Memoize component to avoid unnecessary re-renders
const GitHubLogin = React.memo(() => {
  const router = useRouter();
  const isWeb = Platform.OS === "web";

  // Save user data to AsyncStorage and Firestore – memoized for stable reference
  const saveUserData = useCallback(async (user) => {
    try {
      await AsyncStorage.setItem("userUID", user.uid);
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName || "",
        email: user.email || "",
        bio: "",
        gender: "Prefer not to say",
        avatarId: "1",
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  }, []);

  // Handle redirect result after GitHub auth (mobile only)
  useEffect(() => {
    if (!isWeb) {
      getRedirectResult(auth)
        .then(async (result) => {
          if (result?.user) {
            await saveUserData(result.user);
            Alert.alert("Success!", `Welcome ${result.user.displayName || "user"}!`);
            router.replace("/Homepage");
          }
        })
        .catch((error) => {
          if (error.code !== "auth/no-credential") {
            console.error("Redirect error:", error);
          }
        });
    }
  }, [isWeb, saveUserData, router]);

  // Listen to auth state changes (works on web and after redirect)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await saveUserData(user);
        router.replace("/Homepage");
      }
    });
    return unsubscribe;
  }, [saveUserData, router]);

  // Main GitHub sign-in handler – memoized
  const signInWithGitHub = useCallback(async () => {
    try {
      // Ensure clean auth state
      await firebaseSignOut(auth);

      const provider = new GithubAuthProvider();
      provider.addScope("read:user user:email");

      if (isWeb) {
        const result = await signInWithPopup(auth, provider);
        if (result?.user) {
          await saveUserData(result.user);
          router.replace("/Homepage");
        }
      } else {
        await signInWithRedirect(auth, provider);
      }
    } catch (error) {
      Alert.alert("Error", "GitHub login failed. Please try again.");
      console.error("GitHub login error:", error);
    }
  }, [isWeb, saveUserData, router]);

  // Navigate back
  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <View style={GitHubLoginStyles.container}>
      <View style={GitHubLoginStyles.gradient}>
        <View style={GitHubLoginStyles.formContainer}>
          <Text style={GitHubLoginStyles.subtitle}>
            Sign in quickly with your GitHub account
          </Text>

          <TouchableOpacity
            style={GitHubLoginStyles.githubButton}
            onPress={signInWithGitHub}
          >
            <Text style={GitHubLoginStyles.githubButtonText}>
              Continue with GitHub
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={goBack}
            style={GitHubLoginStyles.backButtonContainer}
          >
            <Text style={GitHubLoginStyles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

// Display name for React DevTools
GitHubLogin.displayName = "GitHubLogin";

export default GitHubLogin;