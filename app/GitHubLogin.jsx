import React from "react";
import { View, Button, Platform, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { GithubAuthProvider, signInWithCredential, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

WebBrowser.maybeCompleteAuthSession();

const GITHUB_CLIENT_ID = "Ov23ligc3QOBO5Ss6OOD";
const REDIRECT_URI = Linking.createURL("/");

export default function GitHubLogin() {
  const isWeb = Platform.OS === "web";

  const signInWithGitHub = async () => {
    try {
      await firebaseSignOut(auth);

      if (isWeb) {
        const provider = new GithubAuthProvider();
        provider.setCustomParameters({ prompt: "login" });
        const { signInWithPopup } = await import("firebase/auth");
        const result = await signInWithPopup(auth, provider);
        Alert.alert("Kyqe me sukses përmes GitHub!", `Mirë se erdhe ${result.user.displayName}`);
      } else {
        const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(
          REDIRECT_URI
        )}&scope=read:user%20user:email&allow_signup=true&prompt=login`;

        const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI);
        if (result.type === "success" && result.url) {
          const code = new URL(result.url).searchParams.get("code");
          if (code) {
            Alert.alert("Kodi i marrë nga GitHub:", code);
          }
        } else {
          Alert.alert("Login u anulua ose dështoi.");
        }
      }
    } catch (error) {
      Alert.alert("Gabim gjatë login", error.message);
      console.error(error);
    }
  };

  return (
    <View style={{ marginVertical: 16 }}>
      <Button title="Continue with GitHub" onPress={signInWithGitHub} />
    </View>
  );
}
