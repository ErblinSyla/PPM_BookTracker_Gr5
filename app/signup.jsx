import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";


import SignupStyles from "./styles/SignupStyles"; 

export default function Signup() {
  const router = useRouter();

  return (
    <View style={SignupStyles.container}>
      <View style={SignupStyles.gradient}>
        <View style={SignupStyles.formContainer}>
          <Text style={SignupStyles.title}>Create an Account</Text>
          <Text style={SignupStyles.subtitle}>
            Choose a method to continue
          </Text>

          <TouchableOpacity
            style={SignupStyles.button}
            onPress={() => router.push("/SignupEmail")}
          >
            <Text style={SignupStyles.buttonText}>
              Continue with Email
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={SignupStyles.button}
            onPress={() => router.push("/GitHubLogin")}
          >
            <Text style={SignupStyles.buttonText}>
              Continue with GitHub
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/Login")}>
            <Text style={SignupStyles.loginText}>
              Already have an account? Log in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}