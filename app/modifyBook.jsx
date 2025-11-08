"use client";

import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";

import BackgroundGradient from "./components/BackgroundGradient";
import BackButton from "./components/BackButton";
import HeaderTitle from "./components/HeaderTitle";
import BookCover from "./components/BookCover";
import PrimaryButton from "./components/PrimaryButton";
import ReadingStatusField from "./components/ReadingStatusField";
import ProgressField from "./components/ProgressField";
import FinishDateField from "./components/FinishDateField";
import NotesField from "./components/NotesField";
import ReviewField from "./components/ReviewField";
import RatingField from "./components/RatingField";

export default function UpdateBookDetails() {
  const router = useRouter();
  const [book, setBook] = useState(null);

  const [status, setStatus] = useState("to-read");
  const [pagesRead, setPagesRead] = useState("");
  const [totalPages, setTotalPages] = useState("");
  const [finishDate, setFinishDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

  const demoBook = {
    id: "demo-123",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover: null,
  };

  useEffect(() => {
    setBook(demoBook);
  }, []);

  const progress =
    totalPages && pagesRead
      ? Math.min(parseInt(pagesRead) / parseInt(totalPages), 1)
      : 0;

  const saveBook = () => {
    if (Platform.OS === "web") {
      window.alert(
        "Saved (demo)\n" +
          `Status: ${status}\n` +
          `Pages: ${pagesRead}/${totalPages}\n` +
          `Rating: ${rating} stars`
      );
    } else {
      Alert.alert(
        "Saved (demo)",
        `Status: ${status}\nPages: ${pagesRead}/${totalPages}\nRating: ${rating} stars`,
        [{ text: "OK", onPress: () => router.push("/homepage") }]
      );
    }

    router.push("/homepage");
  };

  if (!book) {
    return (
      <BackgroundGradient>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading book...</Text>
        </View>
      </BackgroundGradient>
    );
  }

  return (
    <BackgroundGradient>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <BackButton onPress={() => router.back()} />
          <HeaderTitle>Update Book</HeaderTitle>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.bookInfo}>
            <BookCover cover={book.cover} title={book.title} />
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.bookAuthor}>by {book.author}</Text>
          </View>

          <View style={styles.container}>
            <ReadingStatusField status={status} onStatusChange={setStatus} />
            <ProgressField
              pagesRead={pagesRead}
              setPagesRead={setPagesRead}
              totalPages={totalPages}
              setTotalPages={setTotalPages}
              progress={progress}
            />
            <FinishDateField
              finishDate={finishDate}
              setFinishDate={setFinishDate}
              showDatePicker={showDatePicker}
              setShowDatePicker={setShowDatePicker}
            />
            <NotesField notes={notes} setNotes={setNotes} />
            <ReviewField review={review} setReview={setReview} />
            <RatingField rating={rating} setRating={setRating} />
          </View>
          <PrimaryButton
            style={styles.buttonContainer}
            title="Save Changes"
            onPress={saveBook}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </BackgroundGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 25,
    paddingHorizontal: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scroll: { paddingHorizontal: 25, paddingBottom: 100 },
  container: {
    maxWidth: 500,
    alignSelf: "center",
    width: "100%",
  },
  bookInfo: { alignItems: "center", marginBottom: 30, marginTop: 20 },
  bookTitle: {
    color: "#550000",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 4,
  },
  bookAuthor: { color: "#550000bb", fontSize: 15, fontStyle: "italic" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#550000", fontSize: 18, fontWeight: "600" },
  buttonContainer: {
    maxWidth: 300,
  },
});
