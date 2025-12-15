import React, { useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { CameraView } from "expo-camera";
import styles from "../styles/AddNewBookStyles";

const CameraCapture = ({ onBack, onCapture }) => {
  const cameraRef = useRef(null);

  return (
    <View style={styles.cameraContainer}>
      <CameraView style={styles.camera} ref={cameraRef} facing="back" />
      <View style={styles.cameraOverlay}>
        <TouchableOpacity onPress={onBack}>
          <Text style={{ fontSize: 24, color: "white", fontWeight: "700" }}>
            Back
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => cameraRef.current && onCapture(await cameraRef.current.takePictureAsync({ quality: 0.8 }))}
        >
          <View style={styles.captureBtn} />
        </TouchableOpacity>
        <View style={{ width: 60 }} />
      </View>
    </View>
  );
};

export default React.memo(CameraCapture);
