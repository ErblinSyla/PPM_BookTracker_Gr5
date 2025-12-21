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
        name="Login"
        options={{
          headerShown: false,
          title: "Sign In",
          headerStyle: { backgroundColor: "#121212" },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="Signup"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SignupEmail"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="GitHubLogin"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddNewBook"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Homepage"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ModifyBook"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Profile"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Settings"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="EditProfile" options={{ headerShown: false }} />
    </Stack>
  );
}
