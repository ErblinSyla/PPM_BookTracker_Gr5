import { Animated } from "react-native";

export default function AnimatedSubtitle({ fadeAnim }) {
  return (
    <Animated.Text
      style={{
        opacity: fadeAnim,
        fontSize: 16,
        color: "#550000",
        textAlign: "center",
        lineHeight: 24,
        marginBottom: 30,
        fontWeight: "400",
      }}
    >
      Discover, read, and track your favorite books.
    </Animated.Text>
  );
}
