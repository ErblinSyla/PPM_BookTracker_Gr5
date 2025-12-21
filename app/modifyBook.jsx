"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";
import styles from "./styles/ModifyBookStyles";
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
import SessionTimeField from "./components/SessionTimeField";
import Spinner from "./components/Spinner";
import NotificationService from "./services/NotificationService";

const demoBook = {
  id: "demo-123",
  title: "Demo Book",
  author: "Demo Author",
  cover: null,
};

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
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionEndTime, setSessionEndTime] = useState(null);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        router.replace("/Login");
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
          setSessionStartTime(found.sessionStartTime ? new Date(found.sessionStartTime) : null);
          setSessionEndTime(found.sessionEndTime ? new Date(found.sessionEndTime) : null);
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

  const progress = useMemo(() => {
    return totalPages && pagesRead
      ? Math.min(parseInt(pagesRead) / parseInt(totalPages), 1)
      : 0;
  }, [pagesRead, totalPages]);

  const renderModal = useCallback(
    () => (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modalType === "success" ? "Success!" : "Error"}
            </Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => {
                  setModalVisible(false);
                  if (modalType === "success") {
                    router.push("/Homepage");
                  }
                }}
              >
                <Text style={styles.confirmButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    ),
    [modalVisible, modalType, modalMessage, router]
  );

  const saveBook = useCallback(async () => {
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
      sessionStartTime: sessionStartTime ? sessionStartTime.toISOString() : null,
      sessionEndTime: sessionEndTime ? sessionEndTime.toISOString() : null,
    };

    try {
      await setDoc(doc(db, "books", book.id), updatedBook);

      if (pagesRead && totalPages) {
        const pagesReadNum = parseInt(pagesRead);
        const totalPagesNum = parseInt(totalPages);
        if (pagesReadNum > 0 && totalPagesNum > 0) {
          try {
            await NotificationService.notifyBookAlmostFinished(
              book.title,
              pagesReadNum,
              totalPagesNum,
              90
            );
          } catch (notifError) {
            console.warn("Notification error:", notifError);
          }
        }
      }

      if (sessionStartTime && sessionEndTime && pagesRead) {
        try {
          const sessionDuration = NotificationService.calculateReadingSessionDuration(
            sessionStartTime.toISOString(),
            sessionEndTime.toISOString()
          );
          if (sessionDuration) {
            await NotificationService.notifySessionCompletion(
              book.title,
              parseInt(pagesRead),
              sessionDuration
            );
          }
        } catch (notifError) {
          console.warn("Session notification error:", notifError);
        }
      }

      setModalType("success");
      setModalMessage("Book updated successfully!");
      setModalVisible(true);
    } catch (err) {
      console.error("Failed to save book:", err);

      setModalType("error");
      setModalMessage(
        "Failed to save changes.\nPlease check your connection and try again."
      );
      setModalVisible(true);
    }
  }, [
    book,
    status,
    pagesRead,
    totalPages,
    finishDate,
    notes,
    review,
    rating,
    sessionStartTime,
    sessionEndTime,
    router,
  ]); // dependecies qe perdoren dhe memoizohen me funksion

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  if (!book) {
    return <Spinner />;
  }

  return (
    <BackgroundGradient>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <BackButton onPress={handleGoBack} />
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
            <SessionTimeField
              sessionStartTime={sessionStartTime}
              setSessionStartTime={setSessionStartTime}
              sessionEndTime={sessionEndTime}
              setSessionEndTime={setSessionEndTime}
              showStartTimePicker={showStartTimePicker}
              setShowStartTimePicker={setShowStartTimePicker}
              showEndTimePicker={showEndTimePicker}
              setShowEndTimePicker={setShowEndTimePicker}
            />
          </View>
          <PrimaryButton
            style={styles.buttonContainer}
            title="Save Changes"
            onPress={saveBook}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      {renderModal()}
    </BackgroundGradient>
  );
}
