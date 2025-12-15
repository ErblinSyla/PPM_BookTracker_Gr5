import React from "react";
import { TouchableOpacity, Text, Image } from "react-native";
import styles from "../screens/styles/AddNewBookStyles";

const CoverPickerButton = ({ cover, onPress }) => {
  return (
    <TouchableOpacity style={styles.imageBtn} onPress={onPress}>
      {cover && (
        <Image
          source={{ uri: cover }}
          style={{ width: 100, height: 150, marginBottom: 8 }}
          resizeMode="cover"
        />
      )}
      <Text style={styles.imageBtnText}>
        {cover ? "Change Cover" : "Upload Cover"}
      </Text>
    </TouchableOpacity>
  );
};

export default React.memo(CoverPickerButton);
