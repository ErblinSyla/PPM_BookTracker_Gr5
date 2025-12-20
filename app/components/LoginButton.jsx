import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styles from "../styles/LoginStyles";

const LoginButton = React.memo(({ handleLogin }) => (
  <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
    <Text style={styles.loginText}>Log In</Text>
  </TouchableOpacity>
));

export default LoginButton;
