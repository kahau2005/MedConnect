import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { modalStyles as styles } from "./Style";

const MedicineInputModal = ({
  visible,
  selectedMed,
  form,
  setForm,
  onBack,
  onSubmit,
}) => {
  const instructionOptions = [
    { label: "Sau ăn", value: "AFTER_MEAL" },
    { label: "Trước ăn", value: "BEFORE_MEAL" },
    { label: "Khi đau", value: "WHEN_PAIN" },
  ];

  useEffect(() => {
    const d = parseFloat(form.dose) || 0;
    const f = parseInt(form.frequency) || 0;
    const day = parseInt(form.duration_day) || 0;

    const total = d * f * day;

    if (String(total) !== form.quantity) {
      setForm((prev) => ({ ...prev, quantity: String(total) }));
    }
  }, [form.dose, form.frequency, form.duration_day]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View style={[styles.formModal, { maxHeight: "85%" }]}>
          {/* HEADER */}
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
            {/* THỜI ĐIỂM UỐNG THUỐC */}
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

            {/* HÀNG 1: LIỀU LƯỢNG & TẦN SUẤT */}
            <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Mỗi lần uống (dose)</Text>
                <TextInput
                  style={[styles.inputField, { marginTop: 8 }]}
                  keyboardType="numeric"
                  placeholder="Ví dụ: 1"
                  placeholderTextColor="#9CA3AF"
                  value={form.dose}
                  onChangeText={(t) => setForm({ ...form, dose: t })}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Số lần/ngày (frequency)</Text>
                <TextInput
                  style={[styles.inputField, { marginTop: 8 }]}
                  keyboardType="numeric"
                  placeholder="Ví dụ: 2"
                  placeholderTextColor="#9CA3AF"
                  value={form.frequency}
                  onChangeText={(t) => setForm({ ...form, frequency: t })}
                />
              </View>
            </View>

            {/* HÀNG 2: SỐ NGÀY UỐNG & TỔNG SỐ LƯỢNG (READ-ONLY) */}
            <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Số ngày uống (duration)</Text>
                <TextInput
                  style={[styles.inputField, { marginTop: 8 }]}
                  keyboardType="numeric"
                  placeholder="Ví dụ: 7"
                  placeholderTextColor="#9CA3AF"
                  value={form.duration_day}
                  onChangeText={(t) => setForm({ ...form, duration_day: t })}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>
                  Tổng số lượng ({selectedMed?.unit || "Viên"})
                </Text>
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

          <TouchableOpacity style={styles.submitBtn} onPress={onSubmit}>
            <Text style={styles.submitBtnText}>Xác nhận thêm thuốc</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default MedicineInputModal;
