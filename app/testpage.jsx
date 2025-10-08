import {Text, View} from "react-native";
import { auth } from '../firebaseConfig';

export default function TestPage() {
    console.log("Firebase Test: ", auth);
    return (
        <View 
        style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        }}
        >
            <Text>Hello World and welcome to the Test Page!</Text>
        </View>

    );
}