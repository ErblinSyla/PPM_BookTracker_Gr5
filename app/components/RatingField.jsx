import { View, Text, Platform } from "react-native";
import { useState } from "react";
import StarRating from "./StarRating";
import { StyleSheet } from "react-native";

export default function RatingField({ rating, setRating }) {
  const isWeb = Platform.OS === "web";
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = isWeb && hoverRating > 0 ? hoverRating : rating;

  return (
    <View style={styles.field}>
      <Text style={styles.label}>Rating</Text>

      <StarRating
        rating={displayRating}
        onRatingChange={setRating}
        onHoverIn={isWeb ? setHoverRating : undefined}
        onHoverOut={isWeb ? () => setHoverRating(0) : undefined}
      />

      <Text style={styles.ratingText}>
        {displayRating === 0 ? "Not rated" : `${displayRating} out of 5 stars`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 24 },
  label: {
    color: "#550000",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  ratingText: {
    textAlign: "center",
    color: "#550000",
    fontSize: 14,
    fontWeight: "600",
  },
});
