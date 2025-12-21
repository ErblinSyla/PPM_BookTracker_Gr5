import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styles from "../styles/LoginStyles";

const SignupRedirect = React.memo(({ router }) => (
  <TouchableOpacity onPress={() => router.push("/Signup")}>
    <Text style={styles.signupText}>
      Don’t have an account? <Text style={{ fontWeight: "700" }}>Sign Up</Text>
    </Text>
  </TouchableOpacity>
));

export default SignupRedirect;
