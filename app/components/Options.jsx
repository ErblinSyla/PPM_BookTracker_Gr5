import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Checkbox from "expo-checkbox";
import styles from "../styles/LoginStyles";

const Options = React.memo(({ isChecked, setChecked, router }) => (
  <View style={styles.optionsContainer}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Checkbox
        value={isChecked}
        onValueChange={setChecked}
        color={isChecked ? "#550000" : undefined}
      />
      <Text style={{ marginLeft: 8, color: "#550000" }}>Remember me</Text>
    </View>
    <TouchableOpacity onPress={() => router.push("/ForgotPassword")}>
      <Text style={{ color: "#550000", fontWeight: "500" }}>Forgot Password?</Text>
    </TouchableOpacity>
  </View>
));

export default Options;
