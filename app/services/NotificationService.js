import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

async function requestPermissions() {
    if (!Device.isDevice) {
        console.warn('Must use physical device for Push Notifications');
        return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    return finalStatus === 'granted';
}

async function sendTestNotification(){
    const ok = await requestPermissions();
    if (!ok) throw new Error('Push notification permission not granted');

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.DEFAULT,
        });
    }

    return Notifications.scheduleNotificationAsync({
    content: {
        title: "Test Notification",
        body: 'This is a test notification from NotificationService',
        data: { test: true },
    },
    trigger: {
        type: 'timeInterval',
        seconds: 1,
        repeats: false,
    },
    });
}

export default {
    sendTestNotification,
    requestPermissions,
};