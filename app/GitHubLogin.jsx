import React, { useEffect } from "react";
import { View, Button, Platform, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import {
  GithubAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useRouter } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

export default function GitHubLogin() {
  const router = useRouter();
  const isWeb = Platform.OS === "web";

  useEffect(() => {
    if (!isWeb) {
      getRedirectResult(auth)
        .then((result) => {
          if (result?.user) {
            Alert.alert("Sukses!", `Mirë se erdhe ${result.user.displayName}`);
            router.replace("/home");
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
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
        const { signInWithPopup } = await import("firebase/auth");
        await signInWithPopup(auth, provider);
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