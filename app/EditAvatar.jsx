import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";

const AVATARS = [
  { id: "1", image: require("../assets/avatar01.png") },
  { id: "2", image: require("../assets/avatar02.png") },
  { id: "3", image: require("../assets/avatar03.png") },
  { id: "4", image: require("../assets/avatar04.png") },
  { id: "5", image: require("../assets/avatar05.png") },
  { id: "6", image: require("../assets/avatar06.png") },
  { id: "7", image: require("../assets/avatar07.png") },
  { id: "8", image: require("../assets/avatar08.png") },
  { id: "9", image: require("../assets/avatar09.png") },
  { id: "10", image: require("../assets/avatar10.png") },
  { id: "11", image: require("../assets/avatar11.png") },
  { id: "12", image: require("../assets/avatar12.png") },
  { id: "13", image: require("../assets/avatar13.png") },
  { id: "14", image: require("../assets/avatar14.png") },
  { id: "15", image: require("../assets/avatar15.png") },
];

export default function EditProfile() {
  return (
    <>
      {/* HEADER OFF */}
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.container}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />

        <LinearGradient
          colors={["#FAF0DC", "#F2EBE2"]}
          style={styles.gradient}
        >
          {/* BACK – pa funksionalitet */}
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backText}>← BACK</Text>
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.formContainer}>
              <Text style={styles.title}>Edit Profile</Text>
              <Text style={styles.subtitle}>
                Choose your reading persona
              </Text>

              {/* Avatar kryesor (statik) */}
              <View style={styles.mainAvatarWrapper}>
                <Image
                  source={AVATARS[0].image}
                  style={styles.mainAvatar}
                />
              </View>

              {/* Lista e avatarëve (vetëm UI) */}
              <FlatList
                data={AVATARS}
                keyExtractor={(item) => item.id}
                numColumns={3}
                scrollEnabled={false}
                contentContainerStyle={styles.flatListContent}
                renderItem={({ item }) => (
                  <View style={styles.avatarOption}>
                    <Image
                      source={item.image}
                      style={styles.avatarThumb}
                    />
                  </View>
                )}
              />

              {/* SAVE – pa funksionalitet */}
              <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveButtonText}>SAVE CHANGES</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF0DC",
  },

  gradient: {
    flex: 1,
    paddingHorizontal: 30,
  },

  backButton: {
    marginTop: 10,
    marginBottom: 20,
  },

  backText: {
    color: "#550000",
    fontWeight: "700",
    letterSpacing: 1,
  },

  scrollContent: {
    paddingBottom: 40,
    alignItems: "center",
  },

  formContainer: {
    width: "100%",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#550000",
    letterSpacing: 1,
    marginBottom: 5,
  },

  subtitle: {
    color: "#550000",
    fontStyle: "italic",
    marginBottom: 30,
  },

  mainAvatarWrapper: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: "#550000",
    padding: 5,
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  mainAvatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },

  flatListContent: {
    alignItems: "center",
  },

  avatarOption: {
    margin: 10,
    padding: 5,
    borderRadius: 40,
  },

  avatarThumb: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },

  saveButton: {
    backgroundColor: "#550000",
    paddingVertical: 14,
    borderRadius: 25,
    width: "100%",
    marginTop: 20,
    elevation: 8,
  },

  saveButtonText: {
    textAlign: "center",
    color: "#FAF0DC",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 1,
  },
});
