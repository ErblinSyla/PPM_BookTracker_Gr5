import { View, Image, Text, StyleSheet } from "react-native";

export default function BookCover({ cover, title, style }) {
  return cover ? (
    <Image source={{ uri: cover }} style={[styles.cover, style]} />
  ) : (
    <View style={[styles.placeholder, style]}>
      <Text style={styles.initials}>
        {(title || "").slice(0, 2).toUpperCase() || "LB"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    width: 130,
    height: 190,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: "#550000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  placeholder: {
    width: 130,
    height: 190,
    borderRadius: 14,
    marginBottom: 16,
    backgroundColor: "#ffffff30",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#55000040",
  },
  initials: {
    fontSize: 38,
    color: "#550000",
    fontWeight: "800",
  },
});
