import { Animated, Image } from "react-native";

export default function AnimatedLogo({ fadeAnim, floatAnim }) {
  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: floatAnim }],
        marginBottom: 20,
      }}
    >
      <Image
        source={require("../../assets/book4.png")}
        resizeMode="contain"
        style={{ width: 140, height: 140 }}
      />
    </Animated.View>
  );
}
