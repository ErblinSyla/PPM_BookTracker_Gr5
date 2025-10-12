import {
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  View,
  Animated,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";

export const options = {
  headerShown: false,
};

export default function Index() {
  const router = useRouter();

  const fadeImage = useRef(new Animated.Value(0)).current;
  const slideImage = useRef(new Animated.Value(30)).current;
  const floatImage = useRef(new Animated.Value(0)).current;
  
  const fadeTitle = useRef(new Animated.Value(0)).current;
  const slideTitle = useRef(new Animated.Value(30)).current;
  const fadeSubtitle = useRef(new Animated.Value(0)).current;
  const fadeQuote = useRef(new Animated.Value(0)).current;
  const floatTitle = useRef(new Animated.Value(0)).current;
  const floatSubtitle = useRef(new Animated.Value(0)).current;
  const floatQuote = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeImage, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideImage, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeTitle, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideTitle, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    }, 200);

    const subtitleTimer = setTimeout(() => {
      Animated.timing(fadeSubtitle, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 600);

    const quoteTimer = setTimeout(() => {
      Animated.timing(fadeQuote, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 1000);

    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatImage, {
            toValue: -4,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(floatImage, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(floatTitle, {
            toValue: -4,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(floatTitle, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(floatSubtitle, {
            toValue: 4,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(floatSubtitle, {
            toValue: 0,
            duration: 2500,
            useNativeDriver: true,
          }),
        ])
      ).start();

      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(floatQuote, {
              toValue: -3,
              duration: 3000,
              useNativeDriver: true,
            }),
            Animated.timing(floatQuote, {
              toValue: 0,
              duration: 3000,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }, 1000);
    }, 1500);

    return () => {
      clearTimeout(subtitleTimer);
      clearTimeout(quoteTimer);
    };
  }, []);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#522987", "#4e56c0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <View
          style={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: "#ffffff20",
            top: 100,
            left: -50,
          }}
        />
        <View
          style={{
            position: "absolute",
            width: 250,
            height: 250,
            borderRadius: 125,
            backgroundColor: "#ffffff10",
            bottom: 50,
            right: -80,
          }}
        />
        
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 }}>
          <Animated.Image
            source={require("../assets/book.png")}
            style={[
              {
                opacity: fadeImage,
                transform: [
                  { translateY: slideImage },
                  { translateY: floatImage },
                ],
                width: 60,
                height: 60,
                marginBottom: 20,
              },
            ]}
            resizeMode="contain"
          />

          <Animated.Text
            style={[
              {
                opacity: fadeTitle,
                transform: [
                  { translateY: slideTitle },
                  { translateY: floatTitle },
                ],
                fontSize: 21,
                fontWeight: "900",
                letterSpacing: 1.2,
                textTransform: "uppercase",
                color: "#FFDD59",
                marginBottom: 12,
                textAlign: "center",
              },
            ]}
          >
            Welcome to BookTracker
          </Animated.Text>

          <Animated.Text
            style={[
              {
                opacity: fadeSubtitle,
                transform: [{ translateY: floatSubtitle }],
                fontSize: 18,
                color: "#FFFFFFCC",
                textAlign: "center",
                fontStyle: "italic",
                lineHeight: 24,
              },
            ]}
          >
            Discover, read, and track your favorite books.
          </Animated.Text>
          
          <TouchableOpacity
            style={[
              {
                transform: [{ scale: buttonScale }],
                backgroundColor: "#FFDD59",
                paddingVertical: 14,
                borderRadius: 30,
                width: "80%",
                maxWidth: 300,
                shadowColor: "#000",
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 6,
                marginTop: 20,
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
            activeOpacity={0.9}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={() => router.push("/signup")}
          >
            <Text
              style={{
                color: "#522987",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Get Started
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={{ padding: 10 }}
            onPress={() => router.push("/login")}
          >
            <Text
              style={{
                textAlign: "center",
                fontStyle: "italic",
                color: "#E0E0E0",
              }}
            >
              Already have an account? Log in.
            </Text>
          </TouchableOpacity>
        </View>
        
        <Animated.View style={{ 
          alignItems: 'center', 
          paddingBottom: 20, 
          paddingLeft: 20, 
          paddingRight: 20,
          opacity: fadeQuote,
          transform: [{ translateY: floatQuote }],
        }}>
          <TouchableOpacity style={{ padding: 10 }}>
            <Text
              style={{
                color: "#FFFFFFB0",
                fontSize: 14,
                fontStyle: "italic",
                textAlign: "center",
                paddingBottom: 25,
              }}
            >
              "A reader lives a thousand lives before he dies." — George R.R. Martin
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
}