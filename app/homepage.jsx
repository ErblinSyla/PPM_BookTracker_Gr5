import {Text, View, StyleSheet,TextInput, TouchableOpacity,Image,ScrollView} from "react-native";
import { auth } from '../firebaseConfig';
import {useRouter} from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function TestPage() {
    console.log("Firebase Test: ", auth);
    const router = useRouter();
    return (
        <LinearGradient colors={["#522987", "#4e56c0"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        flex:1,
        paddingHorizontal: 30,
      }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
            
        <View 
        style={{
           // flex:1,
           paddingTop:50,
           // alignItems:"center",
        }}
        >
          <View style={styles.nav}>
            <Image source={require("../assets/homepage.png")} style={styles.navSymbol}/>
            <Text style={styles.navText}>Home</Text>
        </View>
            <Text style={styles.title}>Lista e Librave</Text>
            <TextInput
                placeholder="Kerko Librin..."
                placeholderTextColor={"lightgray"}
                style={styles.input}
            ></TextInput>

            <View style={styles.libratContainer}>
                <TouchableOpacity style={styles.libri}>
                    <Image source={require("../assets/bookCover.jpg")} style={styles.coverLibri} />
                    <View style={styles.infoContainer}>
                        <Text style={styles.bookTitle}>Titulli i Librit</Text>
                        <Text style={styles.bookAuthor}>Autori</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.libri}>
                    <Image source={require("../assets/bookCover.jpg")} style={styles.coverLibri} />
                    <View style={styles.infoContainer}>
                        <Text style={styles.bookTitle}>Titulli i Librit</Text>
                        <Text style={styles.bookAuthor}>Autori</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.libri}>
                    <Image source={require("../assets/bookCover.jpg")} style={styles.coverLibri} />
                    <View style={styles.infoContainer}>
                        <Text style={styles.bookTitle}>Titulli i Librit</Text>
                        <Text style={styles.bookAuthor}>Autori</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View >
                <TouchableOpacity style={styles.shtoLiber} onPress={() => router.push("/addNewBook")}>
                    <Text style={{ fontSize: 18, color: "lightgray" }}>Shto liber</Text>
                    <Text style={{ fontSize: 18, color: "lightgray" }}>+</Text>
                </TouchableOpacity>
            </View>

            
        </View>
        
        </ScrollView>
        </LinearGradient>

    );
}
const styles = StyleSheet.create({
    scrollContainer: {
    paddingHorizontal: 30,
    paddingTop: 50,
    alignItems: "center",
  }, 
  nav:{
    flexDirection:"row",
    paddingBottom:60,
  },
  navText:{
    marginRight:10,
    fontWeight:"bold",
    fontSize:18,
    color:"gold",
  },
  navSymbol:{
    width:30,
    height:20,
    resizeMode: "cover",

  }
  ,
    title:{
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#FFDD59",
    }, 
    input: {
        width:300,
        height:50,
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
        color: "white",
  },
   shtoLiber: {
    width: 300,
    height: 70,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
 libratContainer: {
  alignItems: "center",
},

libri: {
  width: 300,
  height: 250,
  borderWidth: 1,
  borderColor: "#aaa",
  borderRadius: 10,
  overflow: "hidden",
  marginBottom: 15,
  backgroundColor: "rgba(255,255,255,0.05)",
},

coverLibri: {
  width: "100%",
  height: "70%",  
  resizeMode: "cover",
},

infoContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingVertical: 5,
},

bookTitle: {
  color: "white",
  fontWeight: "bold",
  fontSize: 16,
},

bookAuthor: {
  color: "lightgray",
  fontSize: 14,
},

})