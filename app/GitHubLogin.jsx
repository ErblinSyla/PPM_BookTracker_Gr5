import React, { useEffect } from "react";
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

export default function GitHubLogin() {
  const router = useRouter();
  const isWeb = Platform.OS === "web";
  const [loading, setLoading] = React.useState(false);

  // Ruaj të dhënat e përdoruesit në Firestore + AsyncStorage
  const saveUserData = async (user) => {
    try {
      await AsyncStorage.setItem("userUID", user.uid);

      // Kontrollo nëse përdoruesi ekziston tashmë në Firestore
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
  };

  // Kontrollo nëse përdoruesi është i loguar (përfshirë kur hapet faqja)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await saveUserData(user);
        router.replace("/homepage"); // Ridrejto nëse është i loguar
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Vetëm për mobile: Trajto rezultatin e redirect pas kthimit nga browser
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
  }, []);

  const signInWithGitHub = async () => {
    setLoading(true);
    try {
      const provider = new GithubAuthProvider();
      provider.addScope("read:user user:email");

      if (isWeb) {
        // Web: përdor popup
        const result = await signInWithPopup(auth, provider);
        if (result.user) {
          await saveUserData(result.user);
          Alert.alert("Sukses!", `Mirë se erdhe ${result.user.displayName}!`);
          router.replace("/homepage");
        }
      } else {
        // Mobile: përdor redirect
        await signInWithRedirect(auth, provider);
        // Pas kësaj, app-i do të ridrejtohet te browser dhe do të kthehet (trajtohet nga useEffect-i i dytë)
      }
    } catch (error) {
      console.error("GitHub login error:", error);
      let message = "Login me GitHub dështoi. Provo përsëri.";
      if (error.code === "auth/popup-closed-by-user") {
        message = "Login u anulua.";
      } else if (error.code === "auth/cancelled-popup-request") {
        message = "Veprim i anuluar.";
      }
      Alert.alert("Gabim", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Continue with GitHub</Text>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={signInWithGitHub}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#550000" />
        ) : (
          <Text style={styles.buttonText}>Sign in with GitHub</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} style={styles.backContainer}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#FAF0DC",
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
    paddingVertical: 15,
    width: "100%",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#550000",
    fontWeight: "600",
    fontSize: 16,
  },
  backContainer: {
    marginTop: 30,
  },
  backText: {
    color: "#550000",
    fontSize: 16,
  },
});