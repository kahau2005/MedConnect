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
  ScrollView,
  FlatList,
  Alert,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { modalStyles as styles } from "./Style";
import { UserContext } from "../../contexts/UserContext";
import { authApis, endpoint } from "../../configs/Apis";

const RESULT_TYPES = [
  { id: "BLOOD", name: "Xét nghiệm máu" },
  { id: "URINE", name: "Xét nghiệm nước tiểu" },
  { id: "XRAY", name: "X-quang" },
  { id: "ULTRASOUND", name: "Siêu âm" },
  { id: "OTHER", name: "Khác" },
];

const ResultModal = ({ visible, onClose, appointmentId }) => {
  const [user] = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const [assignedServices, setAssignedServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  const [resultType, setResultType] = useState("OTHER");
  const [conclusion, setConclusion] = useState("");
  const [rows, setRows] = useState([]);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showServicePicker, setShowServicePicker] = useState(false);
  useEffect(() => {
    if (visible && user) {
      fetchServices();
    }
  }, [visible]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await authApis(user.access_token).get(
        endpoint.service(appointmentId),
      );
      setAssignedServices(res.data);
      setSelectedService(null);
      setRows([{ id: Date.now().toString(), key: "", value: "" }]);
      setConclusion("");
      setIsReadOnly(false);
    } catch (err) {
      console.error("Lỗi tải dịch vụ chỉ định:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectService = (svc) => {
    setSelectedService(svc);
    setShowServicePicker(false);

    if (svc.test_result) {
      setIsReadOnly(true);
      setResultType(svc.test_result.result_type || "OTHER");
      setConclusion(svc.test_result.conclusion || "");

      const resData = svc.test_result.result_data || {};
      const parsedRows = Object.entries(resData).map(([k, v], i) => ({
        id: Date.now().toString() + i,
        key: k,
        value: v,
      }));
      setRows(parsedRows.length > 0 ? parsedRows : []);
    } else {
      setIsReadOnly(false);
      setResultType("OTHER");
      setConclusion("");
      setRows([{ id: Date.now().toString(), key: "", value: "" }]);
    }
  };

  const addRow = () => {
    if (isReadOnly) return;
    setRows([
      ...rows,
      { id: Date.now().toString() + Math.random(), key: "", value: "" },
    ]);
  };

  const removeRow = (idToRemove) => {
    if (isReadOnly) return;
    const newRows = rows.filter((r) => r.id !== idToRemove);
    setRows(
      newRows.length > 0
        ? newRows
        : [{ id: Date.now().toString(), key: "", value: "" }],
    );
  };

  const updateRow = (idToUpdate, field, text) => {
    if (isReadOnly) return;
    setRows(
      rows.map((r) => (r.id === idToUpdate ? { ...r, [field]: text } : r)),
    );
  };

  const handleSaveResult = async () => {
    if (!selectedService) return;
    try {
      setLoading(true);
      const resultDataObj = rows.reduce((acc, curr) => {
        if (curr.key.trim() !== "") acc[curr.key] = curr.value;
        return acc;
      }, {});

      const payload = {
        result_type: resultType,
        result_data: resultDataObj,
        conclusion: conclusion,
      };

      await authApis(user.access_token).post(
        `/appointment-services/${selectedService.id}/results/`,
        payload,
      );

      Alert.alert("Thành công", "Đã lưu kết quả xét nghiệm.");
      onClose();
    } catch (err) {
      const msg = err.response?.data?.error || "Không thể lưu kết quả.";
      Alert.alert("Lỗi", msg);
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
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={[styles.formModal, { flex: 0.9, paddingHorizontal: 20 }]}>
          {!showTypePicker && !showServicePicker && (
            <View style={{ flex: 1 }}>
              <View style={styles.formHeader}>
                <Text style={styles.formTitle}>
                  {isReadOnly ? "Chi tiết xét nghiệm" : "Cập nhật kết quả"}
                </Text>
                <TouchableOpacity onPress={onClose}>
                  <Feather name="x" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                {loading && (
                  <ActivityIndicator
                    size="small"
                    color="#0066FF"
                    style={{ marginBottom: 10 }}
                  />
                )}

                {/* 1. NÚT DROPDOWN CHỌN DỊCH VỤ */}
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: 8,
                    marginTop: 10,
                  }}
                >
                  Dịch vụ chỉ định
                </Text>
                <TouchableOpacity
                  onPress={() => setShowServicePicker(true)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#F9FAFB",
                    borderWidth: 1,
                    borderColor: "#0066FF",
                    borderRadius: 12,
                    padding: 14,
                    marginBottom: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      color: selectedService ? "#0066FF" : "#9CA3AF",
                      fontWeight: "600",
                    }}
                  >
                    {selectedService
                      ? selectedService.service.name
                      : "— Chọn dịch vụ xét nghiệm —"}
                  </Text>
                  <Feather name="chevron-down" size={20} color="#0066FF" />
                </TouchableOpacity>

                {selectedService && (
                  <>
                    {isReadOnly && (
                      <View
                        style={{
                          backgroundColor: "#FEF2F2",
                          padding: 12,
                          borderRadius: 8,
                          marginBottom: 15,
                        }}
                      >
                        <Text
                          style={{
                            color: "#EF4444",
                            fontSize: 13,
                            fontWeight: "500",
                            textAlign: "center",
                          }}
                        >
                          Kết quả xét nghiệm cho dịch vụ này đã tồn tại và không
                          thể chỉnh sửa!
                        </Text>
                      </View>
                    )}

                    {/* 2. CHỌN LOẠI ENUM XÉT NGHIỆM */}
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: 8,
                      }}
                    >
                      Loại xét nghiệm
                    </Text>
                    <TouchableOpacity
                      onPress={() => !isReadOnly && setShowTypePicker(true)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor: isReadOnly ? "#F3F4F6" : "#F9FAFB",
                        borderWidth: 1,
                        borderColor: "#E5E7EB",
                        borderRadius: 12,
                        padding: 14,
                        marginBottom: 20,
                      }}
                      disabled={isReadOnly}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: "#111827",
                          fontWeight: "500",
                        }}
                      >
                        {RESULT_TYPES.find((t) => t.id === resultType)?.name ||
                          "Khác"}
                      </Text>
                      {!isReadOnly && (
                        <Feather
                          name="chevron-down"
                          size={20}
                          color="#6B7280"
                        />
                      )}
                    </TouchableOpacity>

                    {/* 3. NHẬP CHỈ SỐ XÉT NGHIỆM DẠNG CẶP KEY - VALUE */}
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
                            backgroundColor: isReadOnly ? "#F3F4F6" : "#F9FAFB",
                            borderWidth: 1,
                            borderColor: "#E5E7EB",
                            borderRadius: 10,
                            padding: 12,
                            fontSize: 14,
                            color: isReadOnly ? "#6B7280" : "#111827",
                            marginRight: 6,
                          }}
                          placeholder="Chỉ số (VD: Đường huyết)"
                          value={row.key}
                          onChangeText={(t) => updateRow(row.id, "key", t)}
                          editable={!isReadOnly}
                        />
                        <TextInput
                          style={{
                            flex: 1,
                            backgroundColor: isReadOnly ? "#F3F4F6" : "#F9FAFB",
                            borderWidth: 1,
                            borderColor: "#E5E7EB",
                            borderRadius: 10,
                            padding: 12,
                            fontSize: 14,
                            color: isReadOnly ? "#6B7280" : "#111827",
                            marginRight: isReadOnly ? 0 : 10,
                          }}
                          placeholder="Giá trị (VD: 16.5)"
                          value={row.value}
                          onChangeText={(t) => updateRow(row.id, "value", t)}
                          editable={!isReadOnly}
                        />
                        {!isReadOnly && (
                          <TouchableOpacity
                            onPress={() => removeRow(row.id)}
                            style={{ padding: 4 }}
                          >
                            <Feather name="trash-2" size={20} color="#EF4444" />
                          </TouchableOpacity>
                        )}
                      </View>
                    ))}

                    {!isReadOnly && (
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
                    )}

                    {/* 4. KẾT LUẬN */}
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
                        backgroundColor: isReadOnly ? "#F3F4F6" : "#F9FAFB",
                        borderWidth: 1,
                        borderColor: "#E5E7EB",
                        borderRadius: 12,
                        padding: 12,
                        fontSize: 15,
                        color: isReadOnly ? "#6B7280" : "#111827",
                        minHeight: 100,
                        textAlignVertical: "top",
                      }}
                      placeholder="Nhập kết luận chuyên môn..."
                      multiline
                      value={conclusion}
                      onChangeText={setConclusion}
                      editable={!isReadOnly}
                    />
                  </>
                )}
              </ScrollView>

              {!isReadOnly && selectedService && (
                <View
                  style={{
                    paddingTop: 16,
                    borderTopWidth: 1,
                    borderTopColor: "#E5E7EB",
                  }}
                >
                  <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={handleSaveResult}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFF" />
                    ) : (
                      <Text style={styles.submitBtnText}>Lưu kết quả</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* CHỌN DỊCH VỤ XÉT NGHIỆM TỪ DANH SÁCH ASSIGNED SERVICES */}
          {showServicePicker && (
            <View style={{ flex: 1 }}>
              <View style={styles.formHeader}>
                <TouchableOpacity
                  onPress={() => setShowServicePicker(false)}
                  style={{ marginRight: 12 }}
                >
                  <Feather name="arrow-left" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.formTitle}>Chọn dịch vụ y tế</Text>
              </View>
              <FlatList
                data={assignedServices}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                  const hasResult = item.test_result !== null;
                  return (
                    <TouchableOpacity
                      onPress={() => handleSelectService(item)}
                      style={{
                        padding: 16,
                        marginBottom: 10,
                        borderRadius: 12,
                        backgroundColor: "#F9FAFB",
                        borderWidth: 1,
                        borderColor: "#E5E7EB",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "600",
                          color: "#111827",
                          marginBottom: 6,
                        }}
                      >
                        {item.service.name}
                      </Text>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <MaterialCommunityIcons
                          name={hasResult ? "check-circle" : "clock-outline"}
                          size={16}
                          color={hasResult ? "#10B981" : "#F59E0B"}
                        />
                        <Text
                          style={{
                            fontSize: 13,
                            color: hasResult ? "#10B981" : "#F59E0B",
                            marginLeft: 4,
                          }}
                        >
                          {hasResult ? "Đã có kết quả" : "Chưa có kết quả"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          )}

          {/* CHỌN ENUM LOẠI XÉT NGHIỆM */}
          {showTypePicker && (
            <View style={{ flex: 1 }}>
              <View style={styles.formHeader}>
                <TouchableOpacity
                  onPress={() => setShowTypePicker(false)}
                  style={{ marginRight: 12 }}
                >
                  <Feather name="arrow-left" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.formTitle}>Chọn loại xét nghiệm</Text>
              </View>
              <FlatList
                data={RESULT_TYPES}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setResultType(item.id);
                      setShowTypePicker(false);
                    }}
                    style={{
                      padding: 16,
                      marginBottom: 10,
                      borderRadius: 12,
                      backgroundColor: "#F9FAFB",
                      borderWidth: 1,
                      borderColor: "#E5E7EB",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "500",
                        color: "#111827",
                      }}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ResultModal;
