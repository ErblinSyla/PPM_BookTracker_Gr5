import { Animated } from "react-native";

export default function AnimatedTitle({ fadeAnim }) {
  return (
    <Animated.Text
      style={{
        opacity: fadeAnim,
        fontSize: 28,
        fontWeight: "800",
        color: "#550000",
        textAlign: "center",
        marginBottom: 10,
        letterSpacing: 1,
        textTransform: "uppercase",
      }}
    >
      BookTracker
    </Animated.Text>
  );
}
