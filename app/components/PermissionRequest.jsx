import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../screens/styles/AddNewBookStyles";

const PermissionRequest = ({ message, onRequest }) => {
  return (
    <View style={styles.permissionContainer}>
      <Text style={styles.permissionText}>{message}</Text>
      <TouchableOpacity style={styles.permissionBtn} onPress={onRequest}>
        <Text style={styles.permissionBtnText}>Allow Camera</Text>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(PermissionRequest);
