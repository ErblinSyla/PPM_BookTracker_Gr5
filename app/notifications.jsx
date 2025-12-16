
import {
    View,
    Text,
    StyleSheet
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// import styles from "./styles/NotificationsStyles";

export default function Notifications() {
    return(
        <LinearGradient 
        colors={["#FAF0DC", "#F2EBE2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container} >

        <View style={styles.main_content}>
            <Text>Notifications Screen</Text>
        </View>

        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,  
    },
    safe: {
        flex: 1,
        backgroundColor: "#FAF0DC",
      },
    main_content: {
        marginTop: 100,
        flexDirection:"column",
        justifyContent: "center",
        alignItems: "center",
    },
})