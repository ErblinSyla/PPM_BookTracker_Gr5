import {Stack } from "expo-router";
import {Pressable, Text} from "react-native";
import {useRouter} from "expo-router";

export default function RootLayout() {
    const router = useRouter();
    return ( 
        <Stack>
            <Stack.Screen name="index"
            
            options = {{
                title: "Home Page",
                headerStyle: {
                    backgroundColor: "#121212",
                },
                headerTintColor: "#fff",
                headerLeft: () => (
                    <Pressable onPress= {() => router.push("/testpage")}>
                        <Text style={{color: "white",marginLeft:10}}>Back</Text>
                    </Pressable>
                ), 
                
            }}
            />

        <Stack.Screen 
        name="login"
        options={{
          title: "Login Page",
          headerStyle: { backgroundColor: "#121212" },
          headerTintColor: "#fff",
        }}
      />
        </Stack>
    );
}