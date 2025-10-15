import { Stack } from "expo-router";
import { Pressable, Text } from "react-native";
import { useRouter } from "expo-router";

export default function RootLayout() {
    const router = useRouter();
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
        </Stack>
    );
}