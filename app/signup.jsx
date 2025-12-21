import React, { useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import SignupStyles from "./styles/SignupStyles";

const Signup = React.memo(() => {
  const router = useRouter();

  const handleEmailSignup = useCallback(() => {
    router.push("/SignupEmail");
  }, [router]);

  const handleGitHubSignup = useCallback(() => {
    router.push("/GitHubLogin");
  }, [router]);

  const handleNavigateToLogin = useCallback(() => {
    router.push("/Login");
  }, [router]);

  return (
    <View style={SignupStyles.container}>
      <View style={SignupStyles.gradient}>
        <View style={SignupStyles.formContainer}>
          <Text style={SignupStyles.title}>Create an Account</Text>
          <Text style={SignupStyles.subtitle}>
            Choose a method to continue
          </Text>

          <TouchableOpacity style={SignupStyles.button} onPress={handleEmailSignup}>
            <Text style={SignupStyles.buttonText}>Continue with Email</Text>
          </TouchableOpacity>

          <TouchableOpacity style={SignupStyles.button} onPress={handleGitHubSignup}>
            <Text style={SignupStyles.buttonText}>Continue with GitHub</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNavigateToLogin}>
            <Text style={SignupStyles.loginText}>
              Already have an account? Log in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

Signup.displayName = "Signup"; 

export default Signup;