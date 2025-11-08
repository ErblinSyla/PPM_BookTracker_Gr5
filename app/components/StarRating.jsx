import { View, Text, TouchableOpacity, Platform } from "react-native";
import { StyleSheet } from "react-native";

export default function StarRating({
  rating,
  onRatingChange,
  onHoverIn,
  onHoverOut,
}) {
  const isWeb = Platform.OS === "web";

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          activeOpacity={0.8}
          onPress={() => onRatingChange(star)}
          {...(isWeb && {
            onMouseEnter: () => onHoverIn?.(star),
            onMouseLeave: () => onHoverOut?.(),
          })}
        >
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
    marginHorizontal: 4,
  },
  filled: {
    color: "#550000",
  },
});
