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
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { modalStyles as styles } from "./Style";

const ResultModal = ({
  visible,
  data,
  setData,
  onClose,
  onSubmit,
  loading,
}) => {
  const [rows, setRows] = useState([{ key: "", value: "" }]);

  useEffect(() => {
    if (visible && data.result_data) {
      const initialRows = Object.entries(data.result_data).map(([k, v]) => ({
        key: k,
        value: v,
      }));
      setRows(initialRows.length > 0 ? initialRows : [{ key: "", value: "" }]);
    }
  }, [visible]);

  const addRow = () => setRows([...rows, { key: "", value: "" }]);

  const removeRow = (index) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows.length > 0 ? newRows : [{ key: "", value: "" }]);
  };

  const updateRow = (index, field, text) => {
    const newRows = [...rows];
    newRows[index][field] = text;
    setRows(newRows);

    const resultDataObj = newRows.reduce((acc, curr) => {
      if (curr.key) acc[curr.key] = curr.value;
      return acc;
    }, {});
    setData({ ...data, result_data: resultDataObj });
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={[styles.formModal, { flex: 0.85 }]}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Cập nhật TestResult</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              style={{
                backgroundColor: "#F3F4F6",
                padding: 15,
                borderRadius: 10,
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text style={{ fontWeight: "600", color: "#374151" }}>
                Chọn loại kết quả xét nghiệm ⬇️
              </Text>
            </TouchableOpacity>

            {rows.map((row, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <TextInput
                  style={[styles.inputField, { flex: 1, marginRight: 5 }]}
                  placeholder="Chỉ số (VD: Đường huyết)"
                  value={row.key}
                  onChangeText={(t) => updateRow(index, "key", t)}
                />
                <TextInput
                  style={[styles.inputField, { flex: 1, marginLeft: 5 }]}
                  placeholder="Giá trị (VD: 16.5)"
                  value={row.value}
                  onChangeText={(t) => updateRow(index, "value", t)}
                />

                {/* 🔥 TRASH ICON HERE */}
                <TouchableOpacity
                  onPress={() => removeRow(index)}
                  style={{ marginLeft: 10 }}
                >
                  <Feather name="trash-2" size={20} color="red" />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              style={{
                alignItems: "center",
                padding: 10,
                borderStyle: "dashed",
                borderWidth: 1,
                borderColor: "#0066FF",
                borderRadius: 8,
                marginVertical: 10,
              }}
              onPress={addRow}
            >
              <Feather name="plus" size={24} color="#0066FF" />
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                marginTop: 15,
                marginBottom: 5,
              }}
            >
              Kết luận
            </Text>

            <TextInput
              style={[
                styles.inputField,
                { height: 80, textAlignVertical: "top" },
              ]}
              placeholder="Nhập kết luận..."
              multiline
              value={data.conclusion}
              onChangeText={(t) => setData({ ...data, conclusion: t })}
            />
          </ScrollView>

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={onSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitBtnText}>Lưu kết quả</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ResultModal;
