import React, { useContext, useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

// --- STREAM CHAT IMPORTS (v9) ---
import { StreamChat } from "stream-chat";
import { Chat, Channel, MessageList, MessageComposer } from "stream-chat-expo";

import { UserContext } from "../../contexts/UserContext";
import { authApis, endpoint } from "../../configs/Apis";

const STREAM_API_KEY = "8cwv8s4s37jd";
const chatClient = StreamChat.getInstance(STREAM_API_KEY);

const ChatStream = () => {
  const nav = useNavigation();
  const route = useRoute();
  const appointmentId = route.params?.appointmentId || 1;

  useLayoutEffect(() => {
    nav.setOptions({ headerShown: false });
  }, [nav]);

  const [user] = useContext(UserContext);
  const isDoctor = user?.role === "DOCTOR";

  const [channel, setChannel] = useState(null);
  const [clientReady, setClientReady] = useState(false);

  // Điều khiển hiển thị modal nghiệp vụ
  const [actionMenuVisible, setActionMenuVisible] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);

  // --- MOCK DATA HOÀN TOÀN ĐỂ XEM TRƯỚC ---
  const [prescriptionData, setPrescriptionData] = useState({
    diagnosis: "Viêm loét dạ dày cấp tính",
    note: "Uống thuốc sau bữa ăn 30 phút, kiêng đồ cay nóng.",
  });
  const [medicineData, setMedicineData] = useState({
    prescriptionId: String(appointmentId),
    medicineId: "12",
    quantity: "20",
    instruction: "Sáng 1 viên, tối 1 viên sau khi ăn no",
  });
  const [serviceData, setServiceData] = useState({
    serviceId: "3",
    quantity: "1",
  });
  const [resultData, setResultData] = useState({
    appointmentServiceId: "45",
    result:
      "Hình ảnh niêm mạc dạ dày có vết trợt sung huyết, không có ổ loét sâu.",
  });

  // ==========================================
  // KHỞI TẠO STREAM CHAT
  // ==========================================
  useEffect(() => {
    let isMounted = true;

    const setupStream = async () => {
      try {
        const res = await authApis(user.access_token).get(endpoint.streamToken);
        const { stream_token, user_id, full_name } = res.data;

        if (chatClient.userID) {
          await chatClient.disconnectUser();
        }

        await chatClient.connectUser(
          { id: String(user_id), name: full_name || `User ${user_id}` },
          stream_token,
        );

        const channelId = `appointment_${appointmentId}`;
        const currentChannel = chatClient.channel("messaging", channelId);
        await currentChannel.watch();

        if (isMounted) {
          setChannel(currentChannel);
          setClientReady(true);
        }
      } catch (error) {
        console.error("Lỗi kết nối Stream Chat:", error);
        Alert.alert("Lỗi", "Không thể kết nối đến máy chủ chat.");
      }
    };

    if (user) setupStream();

    return () => {
      isMounted = false;
      chatClient.disconnectUser().catch(console.error);
    };
  }, [user, appointmentId]);

  // ==========================================
  // GIẢ LẬP HÀM XỬ LÝ CLICK (CHẠY CHỮ THÀNH CÔNG MOCK)
  // ==========================================
  const executeMockAction = (successMsg) => {
    setLoadingAction(true);
    // Giả lập độ trễ mạng 800ms để xem hiệu ứng xoay tròn Loading
    setTimeout(() => {
      setLoadingAction(false);
      Alert.alert("Thành công (Dữ liệu mẫu)", successMsg);
      setActiveModal(null);
    }, 800);
  };

  const handleCreatePrescription = () => {
    executeMockAction(
      `Đã tạo đơn thuốc mới cho cuộc hẹn #${appointmentId}!\nChẩn đoán: ${prescriptionData.diagnosis}`,
    );
  };

  const handleAddMedicine = () => {
    executeMockAction(
      `Đã thêm thuốc vào đơn số #${medicineData.prescriptionId}!\nMã thuốc: ${medicineData.medicineId} - SL: ${medicineData.quantity}`,
    );
  };

  const handleAddService = () => {
    executeMockAction(
      `Đã chỉ định dịch vụ cận lâm sàng cho cuộc hẹn!\nMã dịch vụ: ${serviceData.serviceId}`,
    );
  };

  const handleAddTestResult = () => {
    executeMockAction(
      `Đã cập nhật kết quả cho chỉ định dịch vụ #${resultData.appointmentServiceId}!\nKết quả: ${resultData.result}`,
    );
  };

  // ==========================================
  // LOADING STATE
  // ==========================================
  if (!clientReady || !channel) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066FF" />
        <Text style={styles.loadingText}>Đang kết nối phòng khám...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* NÚT FLOAT NGHIỆP VỤ BÁC SĨ */}
      {isDoctor && (
        <TouchableOpacity
          style={styles.floatingActionButton}
          onPress={() => setActionMenuVisible(true)}
        >
          <MaterialCommunityIcons
            name="medical-bag"
            size={26}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      )}

      {/* STREAM CHAT UI */}
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "android" ? 90 : 0}
          >
            <MessageList />
            <MessageComposer />
          </KeyboardAvoidingView>
        </Channel>
      </Chat>

      {/* MODAL: CHỌN CHỨC NĂNG */}
      <Modal visible={actionMenuVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActionMenuVisible(false)}
        >
          <View style={styles.actionSheet}>
            <View style={styles.dragIndicator} />
            <Text style={styles.actionSheetTitle}>
              Nghiệp vụ Y tế (Mock Data)
            </Text>

            {[
              {
                modal: "PRESCRIPTION",
                bg: "#EBF4FF",
                icon: "prescription",
                color: "#0066FF",
                label: "Tạo đơn thuốc mới",
              },
              {
                modal: "MEDICINE",
                bg: "#E8FBF4",
                icon: "pill",
                color: "#00D084",
                label: "Thêm thuốc vào đơn",
              },
              {
                modal: "SERVICE",
                bg: "#FFF7E6",
                icon: "needle",
                color: "#FF9800",
                label: "Chỉ định dịch vụ cận lâm sàng",
              },
              {
                modal: "RESULT",
                bg: "#F3E8FF",
                icon: "file-document-edit-outline",
                color: "#9333EA",
                label: "Cập nhật kết quả cận lâm sàng",
              },
            ].map(({ modal, bg, icon, color, label }) => (
              <TouchableOpacity
                key={modal}
                style={styles.actionItem}
                onPress={() => {
                  setActionMenuVisible(false);
                  setActiveModal(modal);
                }}
              >
                <View style={[styles.actionIconBox, { backgroundColor: bg }]}>
                  <MaterialCommunityIcons name={icon} size={24} color={color} />
                </View>
                <Text style={styles.actionItemText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* MODAL FORM 1: TẠO ĐƠN THUỐC */}
      <Modal
        visible={activeModal === "PRESCRIPTION"}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.formModal}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Khởi tạo đơn thuốc</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Feather name="x" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.inputField}
              placeholder="Chẩn đoán lâm sàng..."
              placeholderTextColor="#9CA3AF"
              value={prescriptionData.diagnosis}
              onChangeText={(t) =>
                setPrescriptionData({ ...prescriptionData, diagnosis: t })
              }
            />
            <TextInput
              style={[
                styles.inputField,
                { height: 80, textAlignVertical: "top" },
              ]}
              placeholder="Ghi chú lời dặn..."
              placeholderTextColor="#9CA3AF"
              multiline
              value={prescriptionData.note}
              onChangeText={(t) =>
                setPrescriptionData({ ...prescriptionData, note: t })
              }
            />
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleCreatePrescription}
              disabled={loadingAction}
            >
              {loadingAction ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.submitBtnText}>
                  Xác nhận Tạo (Dữ liệu mẫu)
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL FORM 2: THÊM THUỐC */}
      <Modal
        visible={activeModal === "MEDICINE"}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.formModal}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Thêm chi tiết thuốc</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Feather name="x" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.inputField}
              placeholder="Mã đơn thuốc"
              keyboardType="numeric"
              value={medicineData.prescriptionId}
              onChangeText={(t) =>
                setMedicineData({ ...medicineData, prescriptionId: t })
              }
            />
            <TextInput
              style={styles.inputField}
              placeholder="Mã thuốc"
              keyboardType="numeric"
              value={medicineData.medicineId}
              onChangeText={(t) =>
                setMedicineData({ ...medicineData, medicineId: t })
              }
            />
            <TextInput
              style={styles.inputField}
              placeholder="Số lượng"
              keyboardType="numeric"
              value={medicineData.quantity}
              onChangeText={(t) =>
                setMedicineData({ ...medicineData, quantity: t })
              }
            />
            <TextInput
              style={styles.inputField}
              placeholder="Cách dùng"
              value={medicineData.instruction}
              onChangeText={(t) =>
                setMedicineData({ ...medicineData, instruction: t })
              }
            />
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleAddMedicine}
              disabled={loadingAction}
            >
              {loadingAction ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.submitBtnText}>
                  Xác nhận Thêm thuốc (Dữ liệu mẫu)
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL FORM 3: CHỈ ĐỊNH DỊCH VỤ */}
      <Modal
        visible={activeModal === "SERVICE"}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.formModal}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Chỉ định dịch vụ</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Feather name="x" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.inputField}
              placeholder="Mã dịch vụ"
              keyboardType="numeric"
              value={serviceData.serviceId}
              onChangeText={(t) =>
                setServiceData({ ...serviceData, serviceId: t })
              }
            />
            <TextInput
              style={styles.inputField}
              placeholder="Số lượng"
              keyboardType="numeric"
              value={serviceData.quantity}
              onChangeText={(t) =>
                setServiceData({ ...serviceData, quantity: t })
              }
            />
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleAddService}
              disabled={loadingAction}
            >
              {loadingAction ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.submitBtnText}>
                  Xác nhận Chỉ định (Dữ liệu mẫu)
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL FORM 4: KẾT QUẢ XÉT NGHIỆM */}
      <Modal
        visible={activeModal === "RESULT"}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.formModal}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>
                Cập nhật kết quả cận lâm sàng
              </Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Feather name="x" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.inputField}
              placeholder="Mã chi tiết dịch vụ cuộc hẹn"
              keyboardType="numeric"
              value={resultData.appointmentServiceId}
              onChangeText={(t) =>
                setResultData({ ...resultData, appointmentServiceId: t })
              }
            />
            <TextInput
              style={[
                styles.inputField,
                { height: 100, textAlignVertical: "top" },
              ]}
              placeholder="Nội dung kết quả..."
              multiline
              value={resultData.result}
              onChangeText={(t) => setResultData({ ...resultData, result: t })}
            />
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleAddTestResult}
              disabled={loadingAction}
            >
              {loadingAction ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.submitBtnText}>
                  Xác nhận Lưu kết quả (Dữ liệu mẫu)
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: { marginTop: 10, color: "#6B7280" },
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  floatingActionButton: {
    position: "absolute",
    right: 20,
    bottom: 90,
    zIndex: 99,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  actionSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 20,
  },
  actionSheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 20,
  },
  actionItem: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  actionIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  actionItemText: { fontSize: 16, fontWeight: "600", color: "#374151" },
  formModal: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  formHeader: {
    flexDirection: "row",
    justifycontent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  formTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  inputField: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    marginBottom: 16,
    color: "#111827",
  },
  submitBtn: {
    backgroundColor: "#0066FF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  submitBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
});

export default ChatStream;
