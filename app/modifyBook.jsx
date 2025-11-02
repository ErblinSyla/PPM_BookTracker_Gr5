"use client";

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Progress from "react-native-progress";

export default function UpdateBookDetails() {
  const router = useRouter();
  // const { editId } = useLocalSearchParams();
  const [book, setBook] = useState(null);

  const [status, setStatus] = useState("to-read");
  const [pagesRead, setPagesRead] = useState("");
  const [totalPages, setTotalPages] = useState("");
  const [finishDate, setFinishDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

  // useEffect(() => {
  //   const loadBook = async () => {
  //     if (!editId) return;
  //     try {
  //       const stored = await AsyncStorage.getItem("books");
  //       if (stored) {
  //         const books = JSON.parse(stored);
  //         const found = books.find((b) => b.id === editId);
  //         if (found) {
  //           setBook(found);
  //           // Pre-fill form
  //           setStatus(found.status || "to-read");
  //           setPagesRead(found.pagesRead?.toString() || "");
  //           setTotalPages(found.totalPages?.toString() || "");
  //           setFinishDate(found.finishDate ? new Date(found.finishDate) : null);
  //           setNotes(found.notes || "");
  //           setReview(found.review || "");
  //           setRating(found.rating || 0);
  //         }
  //       }
  //     } catch (err) {
  //       console.error("Failed to load book:", err);
  //     }
  //   };
  //   loadBook();
  // }, [editId]);

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

  // const saveBook = async () => {
  //   if (!book) return;

  //   const updatedBook = {
  //     ...book,
  //     status,
  //     pagesRead: pagesRead ? parseInt(pagesRead) : null,
  //     totalPages: totalPages ? parseInt(totalPages) : null,
  //     finishDate: finishDate ? finishDate.toISOString() : null,
  //     notes: notes.trim(),
  //     review: review.trim(),
  //     rating,
  //   };

  //   try {
  //     const stored = await AsyncStorage.getItem("books");
  //     const books = stored ? JSON.parse(stored) : [];
  //     const index = books.findIndex((b) => b.id === editId);
  //     if (index !== -1) {
  //       books[index] = updatedBook;
  //       await AsyncStorage.setItem("books", JSON.stringify(books));
  //       Alert.alert("Success", "Book updated successfully!", [
  //         { text: "OK", onPress: () => router.back() },
  //       ]);
  //     }
  //   } catch (err) {
  //     Alert.alert("Error", "Failed to save changes.");
  //   }
  // };

  const saveBook = () => {
    Alert.alert(
      "Saved (demo)",
      `Status: ${status}\nPages: ${pagesRead}/${totalPages}\nRating: ${rating} stars`,
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <TouchableOpacity key={star} onPress={() => setRating(star)}>
        <Text style={[styles.star, rating >= star && styles.starFilled]}>
          {rating >= star ? "★" : "☆"}
        </Text>
      </TouchableOpacity>
    ));
  };

  if (!book) {
    return (
      <LinearGradient
        colors={["#522987", "#4e56c0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.loadingContainer}
      >
        <StatusBar style="light" />
        <Text style={styles.loadingText}>Loading book...</Text>
      </LinearGradient>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={["#FAF0DC", "#F2EBE2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.backBtn}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Update Book</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView contentContainerStyle={styles.scroll}>
            <View style={styles.bookInfo}>
              {book.cover ? (
                <Image source={{ uri: book.cover }} style={styles.cover} />
              ) : (
                <View style={styles.coverPlaceholder}>
                  <Text style={styles.coverInitials}>
                    {(book.title || "").slice(0, 2).toUpperCase() || "LB"}
                  </Text>
                </View>
              )}
              <Text style={styles.bookTitle}>{book.title}</Text>
              <Text style={styles.bookAuthor}>by {book.author}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Reading Status</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={status}
                  onValueChange={setStatus}
                  style={styles.picker}
                  dropdownIconColor="#550000"
                >
                  <Picker.Item label="To Read" value="to-read" />
                  <Picker.Item label="Currently Reading" value="reading" />
                  <Picker.Item label="Finished" value="finished" />
                </Picker>
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Reading Progress</Text>
              <View style={styles.progressRow}>
                <TextInput
                  style={styles.inputSmall}
                  value={pagesRead}
                  onChangeText={setPagesRead}
                  keyboardType="numeric"
                  placeholder="0"
                />
                <Text style={styles.slash}>/</Text>
                <TextInput
                  style={styles.inputSmall}
                  value={totalPages}
                  onChangeText={setTotalPages}
                  keyboardType="numeric"
                  placeholder="350"
                />
                <Text style={styles.pagesText}>pages</Text>
              </View>
              <Progress.Bar
                progress={progress}
                width={null}
                height={10}
                color="#550000"
                unfilledColor="#55000030"
                borderWidth={0}
                borderRadius={5}
                style={styles.progressBar}
              />
              <Text style={styles.progressText}>
                {progress === 1
                  ? "Completed!"
                  : `${Math.round(progress * 100)}% read`}
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Expected Finish Date</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {finishDate
                    ? finishDate.toLocaleDateString("sq-AL")
                    : "Select date"}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={finishDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) setFinishDate(selectedDate);
                  }}
                />
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Personal Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Favorite quotes, thoughts, ideas..."
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Review (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={review}
                onChangeText={setReview}
                placeholder="Share your thoughts about the book..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Rating</Text>
              <View style={styles.starsContainer}>{renderStars()}</View>
              <Text style={styles.ratingText}>
                {rating === 0 ? "Not rated" : `${rating} out of 5 stars`}
              </Text>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={saveBook}>
              <Text style={styles.saveText}>Save Changes</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FAF0DC" },
  container: { flex: 1 },
  header: {
    paddingTop: 50,
    paddingHorizontal: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: { color: "#550000", fontSize: 16, fontWeight: "600" },
  headerTitle: {
    color: "#550000",
    fontSize: 20,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  scroll: { paddingHorizontal: 25, paddingBottom: 100 },
  bookInfo: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  cover: {
    width: 130,
    height: 190,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: "#550000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  coverPlaceholder: {
    width: 130,
    height: 190,
    borderRadius: 14,
    marginBottom: 16,
    backgroundColor: "#ffffff30",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#55000040",
  },
  coverInitials: { fontSize: 38, color: "#550000", fontWeight: "800" },
  bookTitle: {
    color: "#550000",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 4,
  },
  bookAuthor: { color: "#550000bb", fontSize: 15, fontStyle: "italic" },
  field: { marginBottom: 24 },
  label: {
    color: "#550000",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#55000050",
    borderRadius: 12,
    backgroundColor: "#ffffff30",
    overflow: "hidden",
  },
  picker: { color: "#550000" },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  inputSmall: {
    borderWidth: 1,
    borderColor: "#55000050",
    borderRadius: 8,
    padding: 10,
    width: 70,
    textAlign: "center",
    backgroundColor: "#ffffff30",
    color: "#550000",
    fontWeight: "600",
  },
  slash: { marginHorizontal: 8, fontSize: 16, color: "#550000" },
  pagesText: { marginLeft: 8, color: "#550000", fontWeight: "600" },
  progressBar: { marginTop: 8 },
  progressText: {
    marginTop: 6,
    fontSize: 14,
    color: "#550000",
    textAlign: "center",
    fontWeight: "600",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#55000050",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#ffffff30",
  },
  dateText: { color: "#550000", textAlign: "center", fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#55000050",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#ffffff30",
    color: "#550000",
    fontSize: 15,
  },
  textArea: { height: 100, paddingTop: 14 },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 6,
  },
  star: { fontSize: 32, color: "#55000040" },
  starFilled: { color: "#550000" },
  ratingText: {
    textAlign: "center",
    color: "#550000",
    fontSize: 14,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#550000",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#550000",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  saveText: {
    color: "#FAF0DC",
    fontSize: 17,
    fontWeight: "700",
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
