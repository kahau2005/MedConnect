import React, { useState, useEffect, useContext } from "react";
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
  Alert,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { modalStyles as styles } from "./Style";
import { UserContext } from "../../contexts/UserContext";
import { authApis, endpoint } from "../../configs/Apis";

const DiagnosisModal = ({ visible, onClose, appointmentId }) => {
  const [user] = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const [diseases, setDiseases] = useState([]);
  const [symptoms, setSymptoms] = useState("");
  const [diseaseId, setDiseaseId] = useState(null);
  const [diseaseName, setDiseaseName] = useState("");

  useEffect(() => {
    if (visible && user) {
      loadDataDiagnosis();
    }
  }, [visible]);

  const loadDataDiagnosis = async () => {
    try {
      setLoading(true);
      const [resDisease, resAppt] = await Promise.all([
        authApis(user.access_token).get(endpoint.disease),
        authApis(user.access_token).get(
          endpoint.update_appointment(appointmentId),
        ),
      ]);

      setDiseases(resDisease.data);
      setSymptoms(resAppt.data.symptoms || "");

      const diseaseObj = resAppt.data.diagnosis;
      setDiseaseId(diseaseObj ? diseaseObj.id : null);
      setDiseaseName(diseaseObj ? diseaseObj.name : "");
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDiagnosis = async () => {
    try {
      setLoading(true);
      await authApis(user.access_token).patch(
        endpoint.update_appointment(appointmentId),
        { symptoms: symptoms, diagnosis: diseaseId },
      );
      Alert.alert("Thành công", "Đã cập nhật chẩn đoán bệnh nhân.");
      onClose();
    } catch (err) {
      Alert.alert("Lỗi", "Không thể lưu chẩn đoán.");
    } finally {
      setLoading(false);
    }
  };

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
              {loading && (
                <ActivityIndicator
                  size="large"
                  color="#0066FF"
                  style={{ marginBottom: 10 }}
                />
              )}

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
                      style={[
                        styles.inputField,
                        {
                          minHeight: 100,
                          textAlignVertical: "top",
                          marginBottom: 20,
                        },
                      ]}
                      placeholder="Nhập chuẩn đoán"
                      placeholderTextColor="#6B7280"
                      multiline
                      value={symptoms}
                      onChangeText={setSymptoms}
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
                          color: diseaseId ? "#111827" : "#9CA3AF",
                          fontWeight: diseaseId ? "600" : "400",
                        }}
                      >
                        {diseaseName || "— Chọn loại bệnh —"}
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
                        (!diseaseId || !symptoms) && {
                          backgroundColor: "#9CA3AF",
                        },
                      ]}
                      onPress={handleSaveDiagnosis}
                      disabled={loading || !diseaseId || !symptoms}
                    >
                      <Text style={styles.submitBtnText}>Lưu Chẩn Đoán</Text>
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
                      const isSelected = diseaseId === item.id;
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            setDiseaseId(item.id);
                            setDiseaseName(item.name);
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
