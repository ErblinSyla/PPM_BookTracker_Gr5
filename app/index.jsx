import {Text, View} from "react-native";
import { Link } from "expo-router";

export default function Index() {
    return (
        <View 
        style={{
            flex: 1,
            justifyConntent: "center",
            alignItems: "center",
        }}
        >
            <Text>Hello World!</Text>
            <Link href="/cameraTestPage" style={{fontSize: 20}}>Open Camera</Link>

        </View>

    );
}