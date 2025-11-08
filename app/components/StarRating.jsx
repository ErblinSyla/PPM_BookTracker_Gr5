import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function StarRating({ rating, onRatingChange }) {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => onRatingChange(star)}>
          <Text style={[styles.star, rating >= star && styles.filled]}>
            {rating >= star ? "★" : "☆"}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 6,
  },
  star: {
    fontSize: 32,
    color: "#55000040",
  },
  filled: {
    color: "#550000",
  },
});
