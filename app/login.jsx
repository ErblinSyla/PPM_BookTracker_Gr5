import { View, Text, TextInput, Button, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#e0f7fa",
      }}
    >
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Log In</Text>

      <TextInput
        placeholder="Username or Email"
        style={{
          width: "100%",
          height: 50,
          borderColor: "#ccc",
          borderWidth: 1,
          borderRadius: 8,
          marginBottom: 10,
          paddingLeft: 10,
        }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry={true}
        style={{
          width: "100%",
          height: 50,
          borderColor: "#ccc",
          borderWidth: 1,
          borderRadius: 8,
          marginBottom: 5,
          paddingLeft: 10,
        }}
      />

      <Text
        style={{
          color: "blue",
          marginBottom: 20,
          alignSelf: "flex-start",
          marginLeft: 10,
        }}
      >
        Forgot Password?
      </Text>

      <Button title="Log In" onPress={() => router.push("/testpage")} />

      <Pressable onPress={() => router.push("/signup")}>
        <Text style={{ color: "blue", marginTop: 20 }}>
          Don't have an account? Sign Up.
        </Text>
      </Pressable>
    </View>
  );
}