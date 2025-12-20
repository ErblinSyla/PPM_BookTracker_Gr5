import React from "react";
import { Text, TextInput, View, TouchableOpacity } from "react-native";
import styles from "../styles/LoginStyles";

const PasswordInput = ({ label, value, onChangeText, showPassword, setShowPassword }) => (
  <>
    <Text style={[styles.inputLabel, { marginTop: 15 }]}>{label}</Text>
    <View style={styles.passwordContainer}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Your Password"
        placeholderTextColor="#55000070"
        secureTextEntry={!showPassword}
        style={styles.passwordInput}
      />
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Text style={styles.showText}>{showPassword ? "Hide" : "Show"}</Text>
      </TouchableOpacity>
    </View>
  </>
);

export default PasswordInput;
