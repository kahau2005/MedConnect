import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { modalStyles as styles } from "./Style";
import { UserContext } from "../../contexts/UserContext";
import { authApis, endpoint } from "../../configs/Apis";

const EMPTY_FORM = {
  medicine: null,
  quantity: "1",
  dose: "1",
  frequency: "2",
  duration_day: "7",
  instruction: "AFTER_MEAL",
};

const instructionOptions = [
  { label: "Sau ăn", value: "AFTER_MEAL" },
  { label: "Trước ăn", value: "BEFORE_MEAL" },
];

const MedicineInputModal = ({
  visible,
  selectedPrescription,
  setSelectedPrescription,
  selectedMed,
  onBack,
  onClose,
}) => {
  const [user] = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (visible && selectedMed) {
      setForm({ ...EMPTY_FORM, medicine: selectedMed.id });
    }
  }, [visible, selectedMed]);

  useEffect(() => {
    const d = parseFloat(form.dose) || 0;
    const f = parseInt(form.frequency) || 0;
    const day = parseInt(form.duration_day) || 0;
    const total = d * f * day;
    if (String(total) !== form.quantity && total > 0) {
      setForm((prev) => ({ ...prev, quantity: String(total) }));
    }
  }, [form.dose, form.frequency, form.duration_day]);

  const handleSubmit = async () => {
    const qty = parseInt(form.quantity);
    if (!form.quantity || isNaN(qty) || qty <= 0) {
      Alert.alert("Lỗi", "Số lượng thuốc không hợp lệ!");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        quantity: Number(form.quantity || 0),
        dose: Number(form.dose || 1),
        frequency: Number(form.frequency || 1),
        duration_day: Number(form.duration_day || 1),
        instruction: form.instruction || "AFTER_MEAL",
        medicine: Number(form.medicine),
      };

      await authApis(user.access_token).post(
        endpoint.add_medicine(selectedPrescription.id),
        payload,
      );

      const res = await authApis(user.access_token).get(
        endpoint.medicines_in_prescription(selectedPrescription.id),
      );
      setSelectedPrescription(res.data);
      onBack();
    } catch (error) {
      const errData = error?.response?.data?.err;
      const errorMessage = Array.isArray(errData)
        ? errData[0]
        : errData || "Không xác định!";
      Alert.alert("Lỗi", errorMessage);
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
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior="padding"
        keyboardVerticalOffset="0"
      >
        <View style={[styles.formModal, { maxHeight: "85%" }]}>
          <View style={styles.formHeader}>
            <View
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
            >
              <TouchableOpacity onPress={onBack} style={{ paddingRight: 12 }}>
                <Feather name="arrow-left" size={24} color="#111827" />
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={styles.formTitle}>Chi tiết sử dụng</Text>
                <Text style={styles.headerSubtitle} numberOfLines={1}>
                  {selectedMed?.name}
                </Text>
              </View>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Thời điểm uống thuốc</Text>
              <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
                {instructionOptions.map((opt) => {
                  const isSelected = form.instruction === opt.value;
                  return (
                    <TouchableOpacity
                      key={opt.value}
                      activeOpacity={0.8}
                      style={{
                        flex: 1,
                        backgroundColor: isSelected ? "#0066FF" : "#F3F4F6",
                        paddingVertical: 12,
                        borderRadius: 10,
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: isSelected ? "#0066FF" : "#E5E7EB",
                      }}
                      onPress={() =>
                        setForm({ ...form, instruction: opt.value })
                      }
                    >
                      <Text
                        style={{
                          color: isSelected ? "#FFFFFF" : "#4B5563",
                          fontWeight: isSelected ? "700" : "500",
                          fontSize: 14,
                        }}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Mỗi lần uống (dose)</Text>
                <TextInput
                  style={[styles.inputField, { marginTop: 8 }]}
                  keyboardType="numeric"
                  value={form.dose}
                  onChangeText={(t) => setForm({ ...form, dose: t })}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Số lần/ngày</Text>
                <TextInput
                  style={[styles.inputField, { marginTop: 8 }]}
                  keyboardType="numeric"
                  value={form.frequency}
                  onChangeText={(t) => setForm({ ...form, frequency: t })}
                />
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Số ngày uống</Text>
                <TextInput
                  style={[styles.inputField, { marginTop: 8 }]}
                  keyboardType="numeric"
                  value={form.duration_day}
                  onChangeText={(t) => setForm({ ...form, duration_day: t })}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Tổng số lượng</Text>
                <View
                  style={[
                    styles.inputField,
                    {
                      marginTop: 8,
                      backgroundColor: "#E5E7EB",
                      justifyContent: "center",
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      color: "#111827",
                      fontWeight: "bold",
                    }}
                  >
                    {form.quantity}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitBtnText}>Xác nhận lưu thuốc</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default MedicineInputModal;
