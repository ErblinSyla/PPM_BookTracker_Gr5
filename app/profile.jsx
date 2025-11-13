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
} from "react-native"
import { StatusBar } from "expo-status-bar"
import { useRouter, useLocalSearchParams } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"




export default function Profile(){
    const router = useRouter();
return (
<SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#FAF0DC", "#F2EBE2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push("/homepage")}>
              <Text style={styles.backBtn}>←</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.flex__container}>
            <View style={styles.avatar}>
                <Image 
                    source={require("../assets/profile-image-test.png")}
                    style={styles.avatar__image}/>
                <Text style={styles.avatar__name}>Bessie Cooper</Text>
                <Text style={styles.avatar__email}>cooper33@hotmail.com</Text>
            </View>
            <View style={styles.book__stats}>
                <View style={styles.book__active}>
                    <Text styles={styles.active__num}>14</Text>
                    <Text styles={styles.active__desc}>Active</Text>
                </View>
                <View style={styles.book__pending}>
                    <Text style={styles.pending__num}>06</Text>
                    <Text style={styles.pending__desc}>Pending</Text>
                </View>
                <View styles={styles.book__completed}>
                    <Text style={styles.completed__num}>25</Text>
                    <Text style={styles.completed__desc}>Complete</Text>
                </View>
            </View>
            <View styles={styles.profile__options}>
                <View styles={styles.profile__option}>
                    <View styles={styles.option__icon}>
                        <Image style={styles.option__image}/>
                    </View>
                    <View styles={styles.option__info}>
                        <Text style={styles.info__title}>Username</Text>
                        <Text style={styles.info__desc}>@cooper_bessie</Text>
                    </View>
                    <View styles={styles.option__nav}>
                        <Text styles={styles.nav__arrow}>{'>'}</Text>
                    </View>
                </View>
                <View styles={styles.profile__option}>
                    <View styles={styles.option__icon}>
                        <Image style={styles.option__image}/>
                    </View>
                    <View styles={styles.option__info}>
                        <Text style={styles.info__title}>Notifications</Text>
                        <Text style={styles.info__desc}>Mute, Push, Email</Text>
                    </View>
                    <View styles={styles.option__nav}>
                        <Text styles={styles.nav__arrow}>{'>'}</Text>
                    </View>
                </View>
                <View styles={styles.profile__option}>
                    <View styles={styles.option__icon}>
                        <Image style={styles.option__image}/>
                    </View>
                    <View styles={styles.option__info}>
                        <Text style={styles.info__title}>Settings</Text>
                        <Text style={styles.info__desc}>Security, Privacy</Text>
                    </View>
                    <View styles={styles.option__nav}>
                        <Text styles={styles.nav__arrow}>{'>'}</Text>
                    </View>
                </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
)
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
    justifyContent:"center",
    gap: 30,
  },
  avatar:{
    flexDirection: "column",
    alignItems:"center",
    justifyContent: "center",
    gap:15,
  },
  avatar__image:{
    width: 120,
    height: 120,
    marginBottom:10,
    
  },
  avatar__name:{
    color: "#550000",
    fontSize: 26,
    fontWeight: "700",
  }
  
})
