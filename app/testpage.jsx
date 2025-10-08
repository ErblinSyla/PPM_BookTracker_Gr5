import {Text, View} from "react-native";
import { auth } from '../firebaseConfig';
import {useRouter} from "expo-router";

export default function TestPage() {
    console.log("Firebase Test: ", auth);
    const router = useRouter();
    return (
        <View 
        style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        }}
        >
            <Text>Hello World and welcome to the Test Page!</Text>
            <Text style={{
                fontSize:25,
            }} onPress={() => router.push("/addNewBook")}>Open Camera</Text>
        </View>

    );
}