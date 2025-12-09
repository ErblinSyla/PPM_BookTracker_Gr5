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
import { useRouter, useLocalSearchParams } from "expo-router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";
import { styles } from "./styles/UpdateBookDetails.styles";
import { onAuthStateChanged } from "firebase/auth";

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
  const { editId } = useLocalSearchParams();
  const [book, setBook] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

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
    title: "Demo Book",
    author: "Demo Author",
    cover: null,
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        router.replace("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const loadBook = async () => {
      if (!editId) {
        setBook(demoBook);
        return;
      }
      try {
        const bookRef = doc(db, "books", editId);
        const bookSnap = await getDoc(bookRef);
        if (bookSnap.exists()) {
          const found = { id: bookSnap.id, ...bookSnap.data() };
          setBook(found);
          setStatus(found.status || "to-read");
          setPagesRead(found.pagesRead?.toString() || "");
          setTotalPages(found.totalPages?.toString() || "");
          setFinishDate(found.finishDate ? new Date(found.finishDate) : null);
          setNotes(found.notes || "");
          setReview(found.review || "");
          setRating(found.rating || 0);
        } else {
          console.log("No such book in Firestore!");
          setBook(demoBook);
        }
      } catch (err) {
        console.error("Failed to load book:", err);
        setBook(demoBook);
      }
    };

    loadBook();
  }, [editId]);

  const progress =
    totalPages && pagesRead
      ? Math.min(parseInt(pagesRead) / parseInt(totalPages), 1)
      : 0;

  const saveBook = async () => {
    if (!book) return;

    const updatedBook = {
      ...book,
      status,
      pagesRead: pagesRead ? parseInt(pagesRead) : null,
      totalPages: totalPages ? parseInt(totalPages) : null,
      finishDate: finishDate ? finishDate.toISOString() : null,
      notes: notes.trim(),
      review: review.trim(),
      rating,
    };

    try {
      await setDoc(doc(db, "books", book.id), updatedBook);
      const message = `Status: ${status}\nPages: ${pagesRead}/${totalPages}\nRating: ${rating} stars`;
      if (Platform.OS === "web") {
        window.alert("Book updated successfully!\n" + message);
      } else {
        Alert.alert("Success", "Book updated successfully!", [
          { text: "OK", onPress: () => router.push("/homepage") },
        ]);
      }
      router.push("/homepage");
    } catch (err) {
      console.error("Failed to save book:", err);
      if (Platform.OS === "web") {
        window.alert("Failed to save changes.");
      } else {
        Alert.alert("Error", "Failed to save changes.");
      }
    }
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
