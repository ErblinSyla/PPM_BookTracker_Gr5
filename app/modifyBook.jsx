"use client";

import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Progress from "react-native-progress";

import BackgroundGradient from "./components/BackgroundGradient";
import BackButton from "./components/BackButton";
import HeaderTitle from "./components/HeaderTitle";
import BookCover from "./components/BookCover";
import PrimaryButton from "./components/PrimaryButton";
import StarRating from "./components/StarRating";

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
    Alert.alert(
      "Saved (demo)",
      `Status: ${status}\nPages: ${pagesRead}/${totalPages}\nRating: ${rating} stars`,
      [{ text: "OK", onPress: () => router.back() }]
    );
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

          <View style={(styles.field, styles.container)}>
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

          <View style={(styles.field, styles.container)}>
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

          <View style={(styles.field, styles.container)}>
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

          <View style={(styles.field, styles.container)}>
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

          <View style={(styles.field, styles.container)}>
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

          <View style={(styles.field, styles.container)}>
            <Text style={styles.label}>Rating</Text>
            <StarRating rating={rating} onRatingChange={setRating} />
            <Text style={styles.ratingText}>
              {rating === 0 ? "Not rated" : `${rating} out of 5 stars`}
            </Text>
          </View>

          <PrimaryButton
            title="Save Changes"
            onPress={saveBook}
            style={{ marginTop: 20 }}
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
  container: {
    maxWidth: 500,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 25,
  },
  scroll: { paddingHorizontal: 25, paddingBottom: 100 },
  bookInfo: { alignItems: "center", marginBottom: 30, marginTop: 20 },
  bookTitle: {
    color: "#550000",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 4,
  },
  bookAuthor: { color: "#550000bb", fontSize: 15, fontStyle: "italic" },
  field: { marginBottom: 24, marginTop: 24 },
  label: {
    color: "#550000",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#55000050",
    borderRadius: 12,
    backgroundColor: "#ffffff30",
    overflow: "hidden",
    marginBottom: 12,
  },
  picker: { color: "#550000" },
  progressRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
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
  progressBar: { marginTop: 8, marginBottom: 12 },
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
    marginBottom: 12,
  },
  dateText: {
    color: "#550000",
    textAlign: "center",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#55000050",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#ffffff30",
    color: "#550000",
    fontSize: 15,
    marginBottom: 12,
  },
  textArea: { height: 100, paddingTop: 14 },
  ratingText: {
    textAlign: "center",
    color: "#550000",
    fontSize: 14,
    fontWeight: "600",
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#550000", fontSize: 18, fontWeight: "600" },
});
