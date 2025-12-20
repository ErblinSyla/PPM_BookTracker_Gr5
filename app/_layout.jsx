"use client";

import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { ensureNotificationSettings } from "./services/authService";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await ensureNotificationSettings(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Welcome To BookTracker",
          headerStyle: { backgroundColor: "#121212" },
          headerTintColor: "#fff",
        }}
      />

      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
          title: "Sign In",
          headerStyle: { backgroundColor: "#121212" },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="addNewBook"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="homepage"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="bookDetails"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="modifyBook"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditProfile"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
