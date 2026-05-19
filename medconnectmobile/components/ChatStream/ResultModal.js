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
  FlatList,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { modalStyles as styles } from "./Style";

const RESULT_TYPES = [
  { id: "BLOOD", name: "Xét nghiệm máu" },
  { id: "URINE", name: "Xét nghiệm nước tiểu" },
  { id: "XRAY", name: "X-quang" },
  { id: "ULTRASOUND", name: "Siêu âm" },
  { id: "OTHER", name: "Khác" },
];

const ResultModal = ({
  visible,
  data,
  setData,
  onClose,
  onSubmit,
  loading,
}) => {
  const [rows, setRows] = useState([]);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (visible) {
      setShowPicker(false);
      if (data.result_data && Object.keys(data.result_data).length > 0) {
        const initialRows = Object.entries(data.result_data).map(
          ([k, v], i) => ({
            id: Date.now().toString() + i,
            key: k,
            value: v,
          }),
        );
        setRows(initialRows);
      } else {
        setRows([{ id: Date.now().toString(), key: "", value: "" }]);
      }
    }
  }, [visible]);

  const addRow = () => {
    setRows([
      ...rows,
      { id: Date.now().toString() + Math.random(), key: "", value: "" },
    ]);
  };

  const removeRow = (idToRemove) => {
    const newRows = rows.filter((r) => r.id !== idToRemove);
    const finalRows =
      newRows.length > 0
        ? newRows
        : [{ id: Date.now().toString(), key: "", value: "" }];
    setRows(finalRows);
    syncDataToParent(finalRows);
  };

  const updateRow = (idToUpdate, field, text) => {
    const newRows = rows.map((r) =>
      r.id === idToUpdate ? { ...r, [field]: text } : r,
    );
    setRows(newRows);
    syncDataToParent(newRows);
  };

  const syncDataToParent = (currentRows) => {
    const resultDataObj = currentRows.reduce((acc, curr) => {
      if (curr.key.trim() !== "") acc[curr.key] = curr.value;
      return acc;
    }, {});
    setData({ ...data, result_data: resultDataObj });
  };

  const getSelectedTypeName = () => {
    const type = RESULT_TYPES.find((t) => t.id === data.result_type);
    return type ? type.name : "— Chọn loại kết quả —";
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={[styles.formModal, { flex: 0.9, paddingHorizontal: 20 }]}>
          {!showPicker && (
            <View style={{ flex: 1 }}>
              <View style={styles.formHeader}>
                <Text style={styles.formTitle}>Cập nhật kết quả</Text>
                <TouchableOpacity onPress={onClose}>
                  <Feather name="x" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                {/* Chọn loại xét nghiệm */}
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: 8,
                    marginTop: 10,
                  }}
                >
                  Loại xét nghiệm
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setShowPicker(true)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#F9FAFB",
                    borderWidth: 1,
                    borderColor: "#E5E7EB",
                    borderRadius: 12,
                    padding: 14,
                    marginBottom: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      color: data.result_type ? "#111827" : "#9CA3AF",
                      fontWeight: data.result_type ? "600" : "400",
                    }}
                  >
                    {getSelectedTypeName()}
                  </Text>
                  <Feather name="chevron-down" size={20} color="#6B7280" />
                </TouchableOpacity>

                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: 8,
                  }}
                >
                  Chi tiết chỉ số
                </Text>

                {rows.map((row) => (
                  <View
                    key={row.id}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <TextInput
                      style={{
                        flex: 1,
                        backgroundColor: "#F9FAFB",
                        borderWidth: 1,
                        borderColor: "#E5E7EB",
                        borderRadius: 10,
                        padding: 12,
                        fontSize: 14,
                        color: "#111827",
                        marginRight: 6,
                      }}
                      placeholder="Chỉ số (VD: Đường huyết)"
                      placeholderTextColor="#9CA3AF"
                      value={row.key}
                      onChangeText={(t) => updateRow(row.id, "key", t)}
                    />
                    <TextInput
                      style={{
                        flex: 1,
                        backgroundColor: "#F9FAFB",
                        borderWidth: 1,
                        borderColor: "#E5E7EB",
                        borderRadius: 10,
                        padding: 12,
                        fontSize: 14,
                        color: "#111827",
                        marginRight: 10,
                      }}
                      placeholder="Giá trị (VD: 16.5)"
                      placeholderTextColor="#9CA3AF"
                      value={row.value}
                      onChangeText={(t) => updateRow(row.id, "value", t)}
                    />
                    <TouchableOpacity
                      onPress={() => removeRow(row.id)}
                      style={{ padding: 4 }}
                    >
                      <Feather name="trash-2" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}

                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 12,
                    borderStyle: "dashed",
                    borderWidth: 1,
                    borderColor: "#0066FF",
                    borderRadius: 10,
                    marginVertical: 10,
                    backgroundColor: "#F0F7FF",
                  }}
                  onPress={addRow}
                >
                  <Feather name="plus" size={20} color="#0066FF" />
                  <Text
                    style={{
                      color: "#0066FF",
                      fontWeight: "600",
                      marginLeft: 6,
                    }}
                  >
                    Thêm chỉ số
                  </Text>
                </TouchableOpacity>

                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#374151",
                    marginTop: 15,
                    marginBottom: 8,
                  }}
                >
                  Kết luận của Bác sĩ
                </Text>
                <TextInput
                  style={{
                    backgroundColor: "#F9FAFB",
                    borderWidth: 1,
                    borderColor: "#E5E7EB",
                    borderRadius: 12,
                    padding: 12,
                    fontSize: 15,
                    color: "#111827",
                    minHeight: 100,
                    textAlignVertical: "top",
                  }}
                  placeholder="Nhập kết luận chuyên môn..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  value={data.conclusion}
                  onChangeText={(t) => setData({ ...data, conclusion: t })}
                />
              </ScrollView>

              <View
                style={{
                  paddingTop: 16,
                  borderTopWidth: 1,
                  borderTopColor: "#E5E7EB",
                }}
              >
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
            </View>
          )}

          {showPicker && (
            <View style={{ flex: 1 }}>
              <View style={styles.formHeader}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() => setShowPicker(false)}
                    style={{ marginRight: 12 }}
                  >
                    <Feather name="arrow-left" size={24} color="#111827" />
                  </TouchableOpacity>
                  <Text style={styles.formTitle}>Chọn loại xét nghiệm</Text>
                </View>
              </View>

              <FlatList
                data={RESULT_TYPES}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20, marginTop: 10 }}
                renderItem={({ item }) => {
                  const isSelected = data.result_type === item.id;
                  return (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        setData({ ...data, result_type: item.id });
                        setShowPicker(false);
                      }}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 16,
                        marginBottom: 10,
                        borderRadius: 12,
                        backgroundColor: isSelected ? "#EBF4FF" : "#F9FAFB",
                        borderWidth: 1,
                        borderColor: isSelected ? "#0066FF" : "#E5E7EB",
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: isSelected ? "700" : "500",
                            color: isSelected ? "#0066FF" : "#111827",
                          }}
                        >
                          {item.name}
                        </Text>
                      </View>
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
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ResultModal;
