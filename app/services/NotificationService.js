import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

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

async function scheduleDailyReminder(hour = 18, minute = 30) {
    const ok = await requestPermissions();
    if (!ok) throw new Error('Push notification permission not granted');

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('daily-reminder', {
            name: 'Daily Reminder',
            importance: Notifications.AndroidImportance.DEFAULT,
        });
    }

    return Notifications.scheduleNotificationAsync({
        content: {
            title: "📚 Time to Read!",
            body: "Don't forget your daily reading session. What are you reading today?",
            data: { reminder: true },
            sound: true,
        },
        trigger: {
            type: 'daily',
            hour,
            minute,
            repeats: true,
        },
    });
}

async function cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
}

async function scheduleWeeklySummary(pagesRead = 0, dayOfWeek = 0, hour = 20, minute = 0) {
    const ok = await requestPermissions();
    if (!ok) throw new Error('Push notification permission not granted');

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('weekly-summary', {
            name: 'Weekly Summary',
            importance: Notifications.AndroidImportance.DEFAULT,
        });
    }

    return Notifications.scheduleNotificationAsync({
        content: {
            title: "📖 Weekly Reading Summary",
            body: `Great job! You've read ${pagesRead} pages this week. Keep up the momentum!`,
            data: { 
                summary: true,
                pagesRead: pagesRead,
            },
            sound: true,
        },
        trigger: {
            type: 'weekly',
            weekday: dayOfWeek, 
            hour,
            minute,
        },
    });
}

async function getPagesReadThisWeek(userEmail) {
    try {
        const q = query(
            collection(db, "books"),
            where("userEmail", "==", userEmail)
        );
        const snap = await getDocs(q);
        const books = snap.docs.map((d) => d.data());

        const now = new Date();
        const currentDay = now.getDay();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - currentDay);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const totalPagesThisWeek = books.reduce((total, book) => {
            if (!book.finishDate) return total;

            const finishDate = new Date(book.finishDate);
            
            if (finishDate >= startOfWeek && finishDate <= endOfWeek) {
                return total + (book.pagesRead || 0);
            }
            return total;
        }, 0);

        return totalPagesThisWeek;
    } catch (error) {
        console.error("Error fetching pages read this week:", error);
        return 0;
    }
}

function calculateReadingPercentage(pagesRead, totalPages) {
    if (!totalPages || totalPages === 0) return 0;
    return Math.round((pagesRead / totalPages) * 100);
}

async function notifyBookAlmostFinished(bookTitle, pagesRead, totalPages, thresholdPercentage = 90) {
    const ok = await requestPermissions();
    if (!ok) throw new Error('Push notification permission not granted');

    const percentage = calculateReadingPercentage(pagesRead, totalPages);

    if (percentage < thresholdPercentage) {
        console.log(`Book not at threshold yet. Current: ${percentage}%, Threshold: ${thresholdPercentage}%`);
        return null;
    }

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('book-almost-finished', {
            name: 'Book Almost Finished',
            importance: Notifications.AndroidImportance.DEFAULT,
        });
    }

    return Notifications.scheduleNotificationAsync({
        content: {
            title: "📖 Almost There!",
            body: `You're ${percentage}% done with "${bookTitle}". Just a little more to go!`,
            data: { 
                almostFinished: true,
                bookTitle: bookTitle,
                percentage: percentage,
                pagesRead: pagesRead,
                totalPages: totalPages,
            },
            sound: true,
        },
        trigger: {
            type: 'timeInterval',
            seconds: 1,
            repeats: false,
        },
    });
}

async function calculateReadingStreak(userEmail) {
    try {
        const q = query(
            collection(db, "books"),
            where("userEmail", "==", userEmail)
        );
        const snap = await getDocs(q);
        const books = snap.docs.map((d) => d.data());

        
        const readingDates = new Set();
        
        books.forEach(book => {
            if (book.finishDate && book.pagesRead && book.pagesRead > 0) {
                const date = new Date(book.finishDate);
                const dateString = date.toISOString().split('T')[0]; 
                readingDates.add(dateString);
            }
        });

        if (readingDates.size === 0) return 0;

        const sortedDates = Array.from(readingDates).sort().reverse();
        
        let currentStreak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let checkDate = new Date(today);

        for (let date of sortedDates) {
            const checkDateString = checkDate.toISOString().split('T')[0];
            
            if (date === checkDateString) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else if (date < checkDateString) {
                break;
            }
        }

        return currentStreak;
    } catch (error) {
        console.error("Error calculating reading streak:", error);
        return 0;
    }
}

async function notifyReadingStreakCelebration(streakDays) {
    const ok = await requestPermissions();
    if (!ok) throw new Error('Push notification permission not granted');

    const milestones = [7, 14, 30, 100];
    if (!milestones.includes(streakDays)) {
        console.log(`Streak of ${streakDays} days is not a milestone. Milestones: 7, 14, 30, 100`);
        return null;
    }

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('reading-streak', {
            name: 'Reading Streak',
            importance: Notifications.AndroidImportance.DEFAULT,
        });
    }

    let title = "🔥 Reading Streak!";
    let body = "";
    let emoji = "";

    if (streakDays === 7) {
        emoji = "🌟";
        body = `Amazing! You've maintained a ${streakDays}-day reading streak. Keep it going!`;
    } else if (streakDays === 14) {
        emoji = "⚡";
        body = `Incredible! ${streakDays} consecutive days of reading. You're unstoppable!`;
    } else if (streakDays === 30) {
        emoji = "👑";
        body = `Outstanding! A full month of reading! You're a true bookworm! 📚`;
    } else if (streakDays === 100) {
        emoji = "💎";
        body = `🏆 LEGENDARY! 100 days of reading! You've achieved something extraordinary!`;
    }

    return Notifications.scheduleNotificationAsync({
        content: {
            title: `${emoji} ${title}`,
            body: body,
            data: { 
                streak: true,
                streakDays: streakDays,
            },
            sound: true,
        },
        trigger: {
            type: 'timeInterval',
            seconds: 1,
            repeats: false,
        },
    });
}

function calculateReadingSessionDuration(startTime, endTime) {
    try {
        const start = new Date(startTime);
        const end = new Date(endTime);

        const durationMs = end - start;
        
        if (durationMs < 0) {
            console.error("End time is before start time");
            return null;
        }

        const totalMinutes = Math.floor(durationMs / 60000);
        const minutes = totalMinutes % 60;
        const hours = Math.floor(totalMinutes / 60);
        const seconds = Math.floor((durationMs % 60000) / 1000);

        return {
            totalMinutes,
            hours,
            minutes,
            seconds,
            formatted: hours > 0 
                ? `${hours}h ${minutes}m` 
                : `${minutes}m ${seconds}s`,
            totalSeconds: Math.floor(durationMs / 1000)
        };
    } catch (error) {
        console.error("Error calculating reading session duration:", error);
        return null;
    }
}

async function notifySessionCompletion(bookTitle, pagesRead, sessionDuration) {
    const ok = await requestPermissions();
    if (!ok) throw new Error('Push notification permission not granted');

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('session-completion', {
            name: 'Session Completion',
            importance: Notifications.AndroidImportance.DEFAULT,
        });
    }

    let message = "";
    if (sessionDuration.hours >= 2) {
        message = `🌟 Awesome marathon session! You read ${pagesRead} pages in ${sessionDuration.formatted}. Amazing dedication!`;
    } else if (sessionDuration.totalMinutes >= 60) {
        message = `📖 Great session! You read ${pagesRead} pages in ${sessionDuration.formatted}. Well done!`;
    } else if (sessionDuration.totalMinutes >= 30) {
        message = `✨ Good work! ${pagesRead} pages in ${sessionDuration.formatted}. Keep it up!`;
    } else {
        message = `📚 Nice start! ${pagesRead} pages in ${sessionDuration.formatted}. Every bit counts!`;
    }

    return Notifications.scheduleNotificationAsync({
        content: {
            title: "📚 Reading Session Complete!",
            body: message,
            data: { 
                sessionComplete: true,
                bookTitle: bookTitle,
                pagesRead: pagesRead,
                duration: sessionDuration.formatted,
                totalSeconds: sessionDuration.totalSeconds,
            },
            sound: true,
        },
        trigger: {
            type: 'timeInterval',
            seconds: 1,
            repeats: false,
        },
    });
}

async function cancelDailyReminder() {
    try{
        const notifications = await Notifications.getAllScheduledNotificationsAsync();
        const reminderIds = notifications
            .filter(n=>n.content.data?.reminder)
            .map(n=>n.identifier);

        for (let id of reminderIds) {
            await Notifications.cancelScheduledNotificationAsync(id);
        }
        return true;
    } catch (error) {
        console.error("Error cancelling daily reminders:", error);
        return false;
    }
}

export default {
    sendTestNotification,
    requestPermissions,
    scheduleDailyReminder,
    scheduleWeeklySummary,
    getPagesReadThisWeek,
    calculateReadingPercentage,
    notifyBookAlmostFinished,
    calculateReadingStreak,
    notifyReadingStreakCelebration,
    calculateReadingSessionDuration,
    notifySessionCompletion,
    cancelAllNotifications,
};