import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { modalStyles as styles } from "./Style";

const DiagnosisModal = ({
  visible,
  data,
  setData,
  diseases,
  onClose,
  onSubmit,
  loading,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (visible) {
      setShowPicker(false);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <View
              style={[styles.formModal, { flex: 0.9, paddingHorizontal: 20 }]}
            >
              {!showPicker && (
                <View style={{ flex: 1 }}>
                  <View style={styles.formHeader}>
                    <Text style={styles.formTitle}>Cập nhật chẩn đoán</Text>

                    <TouchableOpacity onPress={onClose}>
                      <Feather name="x" size={24} color="#6B7280" />
                    </TouchableOpacity>
                  </View>

                  <View style={{ marginTop: 10, flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        marginBottom: 8,
                      }}
                    >
                      Triệu chứng lâm sàng
                    </Text>

                    <TextInput
                      style={{
                        backgroundColor: "#F9FAFB",
                        borderWidth: 1,
                        borderColor: "#E5E7EB",
                        borderRadius: 12,
                        padding: 12,
                        fontSize: 15,
                        minHeight: 100,
                        textAlignVertical: "top",
                        marginBottom: 20,
                      }}
                      placeholder="Nhập biểu hiện, triệu chứng..."
                      multiline
                      value={data.symptoms}
                      onChangeText={(t) => setData({ ...data, symptoms: t })}
                    />

                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        marginBottom: 8,
                      }}
                    >
                      Loại bệnh (Chẩn đoán)
                    </Text>

                    <TouchableOpacity
                      onPress={() => setShowPicker(true)}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        backgroundColor: "#F9FAFB",
                        borderWidth: 1,
                        borderColor: "#E5E7EB",
                        borderRadius: 12,
                        padding: 14,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: data.diseaseId ? "#111827" : "#9CA3AF",
                          fontWeight: data.diseaseId ? "600" : "400",
                        }}
                      >
                        {data.diseaseName || "— Chọn loại bệnh —"}
                      </Text>

                      <Feather name="chevron-down" size={20} color="#6B7280" />
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      paddingTop: 16,
                      borderTopWidth: 1,
                      borderTopColor: "#E5E7EB",
                    }}
                  >
                    <TouchableOpacity
                      style={[
                        styles.submitBtn,
                        (!data.diseaseId || !data.symptoms) && {
                          backgroundColor: "#9CA3AF",
                        },
                      ]}
                      onPress={onSubmit}
                      disabled={loading || !data.diseaseId || !data.symptoms}
                    >
                      {loading ? (
                        <ActivityIndicator color="#FFF" />
                      ) : (
                        <Text style={styles.submitBtnText}>Lưu Chẩn Đoán</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {showPicker && (
                <View style={{ flex: 1 }}>
                  <View style={styles.formHeader}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <TouchableOpacity
                        onPress={() => setShowPicker(false)}
                        style={{ marginRight: 12 }}
                      >
                        <Feather name="arrow-left" size={24} color="#111827" />
                      </TouchableOpacity>

                      <Text style={styles.formTitle}>Chọn loại bệnh</Text>
                    </View>
                  </View>

                  <FlatList
                    data={diseases}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => {
                      const isSelected = data.diseaseId === item.id;

                      return (
                        <TouchableOpacity
                          onPress={() => {
                            setData({
                              ...data,
                              diseaseId: item.id,
                              diseaseName: item.name,
                            });
                            setShowPicker(false);
                          }}
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            padding: 14,
                            marginBottom: 8,
                            borderRadius: 12,
                            backgroundColor: isSelected ? "#EBF4FF" : "#F9FAFB",
                            borderWidth: 1,
                            borderColor: isSelected ? "#0066FF" : "#E5E7EB",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: isSelected ? "700" : "500",
                              color: isSelected ? "#0066FF" : "#111827",
                            }}
                          >
                            {item.name}
                          </Text>

                          {isSelected && (
                            <MaterialCommunityIcons
                              name="check-circle"
                              size={22}
                              color="#0066FF"
                            />
                          )}
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default DiagnosisModal;
