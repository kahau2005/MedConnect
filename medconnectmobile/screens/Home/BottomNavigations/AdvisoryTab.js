import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const AdvisoryTab = () => {
  const [inputText, setInputText] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, Admin!</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconAction}>
            <Feather name="phone" size={22} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconAction}>
            <Feather name="video" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.heroSection}>
          <Text style={styles.heroText}>
            Hôm nay bạn đang{"\n"}cảm thấy thế nào?
          </Text>
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.inputArea}>
            <TextInput
              style={styles.textInput}
              placeholder="Nhập triệu chứng..."
              placeholderTextColor="#A0A0A0"
              value={inputText}
              onChangeText={setInputText}
            />

            <TouchableOpacity
              style={styles.sendBtn}
              disabled={inputText.length === 0}
            >
              <Feather
                name="send"
                size={20}
                color={inputText.length > 0 ? "#6B4EFF" : "#D1D1D6"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F6",
    marginTop: Platform.OS === "android" ? 25 : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 18,
    fontFamily: "serif",
    color: "#333",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconAction: {
    marginLeft: 16,
    padding: 4,
  },
  keyboardView: {
    flex: 1,
    justifyContent: "space-between",
  },
  heroSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  heroText: {
    fontSize: 26,
    fontFamily: "serif",
    textAlign: "center",
    color: "#333",
    lineHeight: 36,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 10 : 30,
  },
  inputArea: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    minHeight: 45,
  },
  sendBtn: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AdvisoryTab;
