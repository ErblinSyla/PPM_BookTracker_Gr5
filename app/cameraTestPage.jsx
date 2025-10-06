import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export default function CameraPage() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!mediaPermission) {
      requestMediaPermission();
    }
  }, []);

  if (!permission || !permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Camera permission is needed</Text>
        <Button title="Allow Camera" onPress={requestPermission} />
      </View>
    );
  }

  const takePhoto = async () => {
    const photo = await cameraRef.current.takePictureAsync();
    await MediaLibrary.saveToLibraryAsync(photo.uri);
    alert('Saved to gallery!');
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
      <Button
        title={`Switch to ${facing === 'back' ? 'Front' : 'Back'} Camera`}
        onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
      />
      <Button title="Take Photo" onPress={takePhoto} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
});
