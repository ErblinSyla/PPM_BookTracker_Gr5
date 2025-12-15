import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import styles from "../styles/ProfileStyles";

const ConfirmModal = React.memo(function ConfirmModal({
  visible,
  type,
  data,
  onCancel,
  onConfirm,
}) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {type === "logout" ? "Logout" : "Delete Book"}
          </Text>

          <Text style={styles.modalMessage}>
            {type === "logout"
              ? "Are you sure you want to logout?"
              : `Delete "${data.title || "this book"}"?`}
          </Text>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmButtonText}>
                {type === "logout" ? "Logout" : "Delete"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
});

export default ConfirmModal;
