import { Animated } from "react-native";

export default function AnimatedQuote({ fadeAnim, floatAnim }) {
  return (
    <Animated.Text
      style={{
        position: "absolute",
        bottom: 30,
        fontSize: 14,
        color: "#550000",
        fontStyle: "italic",
        textAlign: "center",
        opacity: fadeAnim,
        transform: [{ translateY: floatAnim }],
        lineHeight: 22,
        width: "90%",
      }}
    >
      “A reader lives a thousand lives before he dies.” — George R.R. Martin
    </Animated.Text>
  );
}
