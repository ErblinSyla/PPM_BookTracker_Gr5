import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();
  const [isChecked, setChecked] = useState(false);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 25,
      }}
    >
  
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ position: "absolute", top: 50, left: 20 }}
      >
        <Text style={{ color: "#6C63FF", fontSize: 16 }}>← Back</Text>
      </TouchableOpacity>

      <Text
        style={{
          fontSize: 28,
          fontWeight: "700",
          color: "#2C2C54",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        Login to your{"\n"}account.
      </Text>

      <Text
        style={{
          color: "#A0A0A0",
          marginBottom: 25,
          textAlign: "center",
        }}
      >
        Hello, welcome back to your account
      </Text>

      <Text
        style={{
          alignSelf: "flex-start",
          color: "#6C63FF",
          marginBottom: 5,
        }}
      >
        E-mail
      </Text>
      <TextInput
        placeholder="example@email.com"
        style={{
          width: "100%",
          height: 50,
          borderWidth: 1,
          borderColor: "#BDBDBD",
          borderRadius: 10,
          paddingLeft: 12,
          marginBottom: 15,
        }}
      />

      <Text
        style={{
          alignSelf: "flex-start",
          color: "#6C63FF",
          marginBottom: 5,
        }}
      >
        Password
      </Text>
      <TextInput
        placeholder="Your Password"
        secureTextEntry
        style={{
          width: "100%",
          height: 50,
          borderWidth: 1,
          borderColor: "#BDBDBD",
          borderRadius: 10,
          paddingLeft: 12,
          marginBottom: 10,
        }}
      />

      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 25,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Checkbox
            value={isChecked}
            onValueChange={setChecked}
            color={isChecked ? "#6C63FF" : undefined}
          />
          <Text style={{ marginLeft: 8, color: "#757575" }}>Remember me</Text>
        </View>

        <TouchableOpacity>
          <Text style={{ color: "#6C63FF", fontWeight: "500" }}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => router.push("/home")}
        style={{
          backgroundColor: "#6C63FF",
          paddingVertical: 14,
          borderRadius: 10,
          width: "100%",
          marginBottom: 25,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "#fff",
            fontWeight: "600",
            fontSize: 16,
          }}
        >
          Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={{ color: "#6C63FF", fontWeight: "500" }}>
          Don’t have an account?{" "}
          <Text style={{ fontWeight: "700" }}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
