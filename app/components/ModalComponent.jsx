import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import styles from "../screens/styles/AddNewBookStyles";

const ModalComponent = ({ visible, type, message, onChoice, onConfirm }) => {
  if (!visible) return null;

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {type === "imagePicker"
              ? "Upload Cover"
              : type === "required"
              ? "Required"
              : "Success!"}
          </Text>
          <Text style={styles.modalMessage}>
            {type === "required" ? message : type === "success" ? "Book added to your library." : "Choose how to add a cover:"}
          </Text>

          <View style={styles.modalButtons}>
            {type === "imagePicker" && (
              <>
                <TouchableOpacity
                  style={[styles.modalButton, styles.optionButton]}
                  onPress={() => onChoice("camera")}
                >
                  <Text style={styles.optionButtonText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.optionButton]}
                  onPress={() => onChoice("gallery")}
                >
                  <Text style={styles.optionButtonText}>Choose from Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => onChoice("cancel")}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}

            {(type === "required" || type === "success") && (
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={onConfirm}
              >
                <Text style={styles.confirmButtonText}>OK</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default React.memo(ModalComponent);
