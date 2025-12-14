import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

const Spinner = ({ size = "large", color = "#550000" }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAF0DC",
  },
});

export default Spinner;
