import React, { useEffect } from "react";
import { View, Button, Platform, Alert } from "react-native";
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
import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

export default function GitHubLogin() {
  const router = useRouter();
  const isWeb = Platform.OS === "web";

  // Funksioni për ruajtjen e userit
  const saveUserData = async (user) => {
    try {
      // Ruaj UID në AsyncStorage
      await AsyncStorage.setItem("userUID", user.uid);

      // Ruaj userin në Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName || "",
        email: user.email || "",
      });
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  useEffect(() => {
    if (!isWeb) {
      getRedirectResult(auth)
        .then(async (result) => {
          if (result?.user) {
            await saveUserData(result.user);
            Alert.alert("Sukses!", `Mirë se erdhe ${result.user.displayName}`);
            router.replace("/homepage");
          }
        })
        .catch((error) => {
          if (error.code !== "auth/no-credential") {
            console.error("Redirect error:", error);
          }
        });
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await saveUserData(user);
        router.replace("/homepage");
      }
    });
    return unsubscribe;
  }, [router]);

  const signInWithGitHub = async () => {
    try {
      await firebaseSignOut(auth);

      const provider = new GithubAuthProvider();
      provider.addScope("read:user user:email");

      if (isWeb) {
        await signInWithPopup(auth, provider).then(async (result) => {
          if (result?.user) {
            await saveUserData(result.user);
            router.replace("/homepage");
          }
        });
      } else {
        await signInWithRedirect(auth, provider);
      }
    } catch (error) {
      Alert.alert("Gabim", "Login me GitHub dështoi. Provo përsëri.");
      console.error(error);
    }
  };

  return (
    <View style={{ marginVertical: 16 }}>
      <Button title="Continue with GitHub" onPress={signInWithGitHub} />
    </View>
  );
}