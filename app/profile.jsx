import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  Platform,
  Button,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function Profile() {
  const router = useRouter();
  return (
    <LinearGradient
      colors={["#FAF0DC", "#F2EBE2"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />

        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push("/")}>
              <Text style={styles.backBtn}>←</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.flex__container}>
            <View style={styles.avatar}>
              <Image
                source={require("../assets/profile-image-test.png")}
                style={styles.avatar__image}
              />
              <Text style={styles.avatar__name}>Bessie Cooper</Text>
              <Text style={styles.avatar__email}>cooper33@hotmail.com</Text>
            </View>
            <View style={styles.book__stats}>
              <TouchableOpacity
                onPress={() => router.push("/homepage")}
                style={styles.book__active}
              >
                <Text style={styles.active__num}>14</Text>
                <Text style={styles.active__desc}>Active</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/homepage")}
                style={styles.book__pending}
              >
                <Text style={styles.pending__num}>06</Text>
                <Text style={styles.pending__desc}>Pending</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/homepage")}
                style={styles.book__completed}
              >
                <Text style={styles.completed__num}>25</Text>
                <Text style={styles.completed__desc}>Complete</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.profile__options}>
              <TouchableOpacity style={styles.profile__option}>
                <View style={styles.option__icon}>
                  <Image
                    source={require("../assets/profile_username-icon.png")}
                    style={styles.option__image}
                  />
                  <View style={styles.option__info}>
                    <Text style={styles.info__title}>Username</Text>
                    <Text style={styles.info__desc}>@cooper_bessie</Text>
                  </View>
                </View>

                <View style={styles.option__nav}>
                  <Image
                    source={require("../assets/profile_arrow-right-icon.png")}
                    style={styles.nav__arrow}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.profile__option}>
                <View style={styles.option__icon}>
                  <Image
                    source={require("../assets/profile_notification-icon.png")}
                    style={styles.option__image}
                  />
                  <View style={styles.option__info}>
                    <Text style={styles.info__title}>Notifications</Text>
                    <Text style={styles.info__desc}>Mute, Push, Email</Text>
                  </View>
                </View>

                <View style={styles.option__nav}>
                  <Image
                    source={require("../assets/profile_arrow-right-icon.png")}
                    style={styles.nav__arrow}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.profile__option, styles.profile__option__end]}
              >
                <View style={styles.option__icon}>
                  <Image
                    source={require("../assets/profile_settings-icon.png")}
                    style={styles.option__image}
                  />
                  <View style={styles.option__info}>
                    <Text style={styles.info__title}>Settings</Text>
                    <Text style={styles.info__desc}>Security, Privacy</Text>
                  </View>
                </View>

                <View style={styles.option__nav}>
                  <Image
                    source={require("../assets/profile_arrow-right-icon.png")}
                    style={styles.nav__arrow}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FAF0DC",
  },
  container: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  header: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backBtn: {
    color: "#550000",
    fontSize: 26,
    fontWeight: "700",
  },
  flex__container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
    marginTop: 30,
  },
  avatar: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  avatar__image: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  avatar__name: {
    color: "#550000",
    fontSize: 26,
    fontWeight: "700",
  },
  avatar__email: {
    color: "#550000",
    fontSize: 16,
    fontWeight: "500",
    opacity: 0.6,
  },
  book__stats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  book__active: {
    width: 90,
    height: 110,
    backgroundColor: "#550000",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  active__num: {
    fontSize: 28,
    color: "#FAF0DC",
    fontWeight: "700",
  },
  active__desc: {
    fontSize: 16,
    color: "#FAF0DC",
    fontWeight: "500",
  },
  book__pending: {
    width: 90,
    height: 110,
    backgroundColor: "#E6D9B8",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  pending__num: {
    fontSize: 28,
    color: "#550000",
    fontWeight: "700",
  },
  pending__desc: {
    fontSize: 16,
    color: "#550000",
    fontWeight: "500",
  },
  book__completed: {
    width: 90,
    height: 110,
    backgroundColor: "#E6D9B8",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  completed__num: {
    fontSize: 28,
    color: "#550000",
    fontWeight: "700",
  },
  completed__desc: {
    fontSize: 16,
    color: "#550000",
    fontWeight: "500",
  },
  profile__options: {
    width: 305,
    height: 275,
    borderRadius: 20,
    padding: 15,
    backgroundColor: "#FCF7E6",
    justifyContent: "space-around",
  },
  profile__option: {
    flexDirection: "row",
    gap: 75,
    alignItems: "center",
    paddingBottom: 15,
    paddingTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(85, 0, 0, 0.1)",
  },
  option__icon: {
    width: 170,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  option__image: {
    width: 40,
    height: 40,
  },
  option__info: {
    gap: 5,
    alignItems: "start",
  },
  info__title: {
    fontSize: 16,
    color: "#550000",
    fontWeight: "700",
  },
  info__desc: {
    fontSize: 12,
    color: "#550000",
    opacity: 0.6,
    fontWeight: "500",
  },
  nav__arrow: {
    width: 25,
    height: 25,
  },
  profile__option__end: {
    borderBottomWidth: 0,
  },
});
