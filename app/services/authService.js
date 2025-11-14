// app/services/authService.js
import { createUserWithEmailAndPassword, signInWithCredential } from "firebase/auth";
import { doc, setDoc,getDoc } from "firebase/firestore";
// Kontrollo rastin e shkronjës C (Capital C) dhe shto .js
import { auth, db } from "../../firebaseConfig.js";
 // dy nivele lart sepse services është brenda app

// Email SignUp
export const registerUserWithEmail = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      createdAt: new Date(),
    });

    return user;
  } catch (error) {
    console.error("Gabim gjatë regjistrimit:", error);
    throw error;
  }
};

// Google SignIn
export const signInWithGoogle = async (credential) => {
  try {
    const userCredential = await signInWithCredential(auth, credential);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      name: user.displayName || "Google User",
      email: user.email,
      createdAt: new Date(),
    }, { merge: true });

    return user;
  } catch (error) {
    console.error("Gabim Google Sign-In:", error);
    throw error;
  }
};

// Apple SignIn
export const signInWithApple = async (identityToken, fullName) => {
  try {
    const { OAuthProvider } = await import("firebase/auth");
    const appleProvider = new OAuthProvider("apple.com");
    const credential = appleProvider.credential({ idToken: identityToken });

    const userCredential = await signInWithCredential(auth, credential);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      name: fullName || "Apple User",
      email: user.email,
      createdAt: new Date(),
    }, { merge: true });

    return user;
  } catch (error) {
    console.error("Gabim Apple Sign-In:", error);
    throw error;
  }
};

//Profile get Username and Email
export const getUserData = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return snap.data();
};