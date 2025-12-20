import React from "react";
import { Text, TextInput } from "react-native";
import styles from "../styles/LoginStyles";

const Input = ({ label, value, onChangeText, placeholder }) => (
  <>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#55000070"
      style={styles.input}
    />
  </>
);

export default Input;
