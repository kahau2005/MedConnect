import React, { useContext, useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";

// --- STREAM CHAT IMPORTS ---
import { StreamChat } from "stream-chat";
import { Chat, Channel, MessageList, MessageComposer } from "stream-chat-expo";

import { UserContext } from "../../contexts/UserContext";
import Apis, { authApis, endpoint } from "../../configs/Apis";

// --- SUB COMPONENTS ---
import Header from "../../components/ChatStream/Header";
import DoctorActionSheet from "../../components/ChatStream/DoctorActionSheet";
import PrescriptionListModal from "../../components/ChatStream/PrescriptionListModal";
import MedicineSearchModal from "../../components/ChatStream/MedicineSearchModal";
import MedicineInputModal from "../../components/ChatStream/MedicineInputModal";
import ServiceModal from "../../components/ChatStream/ServiceModal";
import ResultModal from "../../components/ChatStream/ResultModal";
import DiagnosisModal from "../../components/ChatStream/DiagnosisModal";

// --- CONSTANTS ---
const STREAM_API_KEY = "6eqc726krv44";
const chatClient = StreamChat.getInstance(STREAM_API_KEY);

const EMPTY_MED_FORM = {
  medicine: null,
  detailId: null,
  quantity: "1",
  dose: "1",
  frequency: "2",
  duration_day: "7",
  instruction: "AFTER_MEAL",
};

const ChatStream = () => {
  // ==========================================
  // 1. SETUP & GLOBAL STATE
  // ==========================================
  const nav = useNavigation();
  const route = useRoute();
  const appointmentId = route.params?.appointmentId || 1;
  const status = route.params?.status || "SCHEDULED";
  const [user] = useContext(UserContext);

  // ==========================================
  // 2. UI & MODAL STATE
  // ==========================================
  const [actionMenuVisible, setActionMenuVisible] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);

  // ==========================================
  // 3. DATA STATE
  // ==========================================
  const [channel, setChannel] = useState(null);
  const [clientReady, setClientReady] = useState(false);

  // Chỉ Doctor mới dùng các state này, nhưng khai báo thì không ảnh hưởng
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [selectedMedForInput, setSelectedMedForInput] = useState(null);
  const [medInputForm, setMedInputForm] = useState(EMPTY_MED_FORM);

  const [medSearchKw, setMedSearchKw] = useState("");
  const [medCategoryId, setMedCategoryId] = useState("ALL");
  const [medicines, setMedicines] = useState([]);
  const [medicineCategories, setMedicineCategories] = useState([]);
  const [loadingMedicines, setLoadingMedicines] = useState(false);

  const [listService, setListService] = useState([]);
  const [assignedServices, setAssignedServices] = useState([]);
  const [serviceData, setServiceData] = useState({
    serviceId: null,
    quantity: "1",
    detailId: null,
  });

  const [resultData, setResultData] = useState({
    result_type: "ULTRASOUND",
    result_data: {},
    conclusion: "",
  });

  const [listDisease, setListDisease] = useState([]);
  const [diagnosisData, setDiagnosisData] = useState({
    symptoms: "",
    diseaseId: null,
    diseaseName: "",
  });

  // ==========================================
  // 4. LOGIC: KHỞI TẠO DỮ LIỆU BAN ĐẦU
  // ==========================================
  useEffect(() => {
    if (user) {
      // 🌟 FIX: Kiểm tra BẮT BUỘC phải là DOCTOR mới cho phép Fetch các API nghiệp vụ
      if (user.role === "DOCTOR") {
        handleUpdateAppointmentStatus();
        getListPrescriptions();
        loadMedicineCategories();
        loadService();
        loadAssignedServices();
        loadDataDiagnosis();
      }
    }
  }, [user]);

  const handleUpdateAppointmentStatus = async () => {
    if (status === "PENDING") return;
    try {
      await authApis(user.access_token).patch(
        `${endpoint.appointment}${appointmentId}/`,
        { status: "PENDING" },
      );
    } catch (err) {
      console.error("Lỗi API update status:", err);
    }
  };

  const loadMedicineCategories = async () => {
    try {
      const res = await authApis(user.access_token).get(
        endpoint.medicine_categories,
      );
      setMedicineCategories(res.data);
    } catch (error) {
      console.log("Lỗi tải danh mục thuốc:", error);
    }
  };

  const getListPrescriptions = async () => {
    try {
      const res = await authApis(user.access_token).get(
        endpoint.prescription(appointmentId),
      );
      setPrescriptions(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách đơn thuốc:", error);
    }
  };

  const loadService = async () => {
    try {
      const res = await Apis.get(endpoint.services);
      setListService(res.data);
    } catch (error) {
      console.error("Lỗi tải danh mục dịch vụ:", error);
    }
  };

  const loadAssignedServices = async () => {
    try {
      const res = await authApis(user.access_token).get(
        endpoint.service(appointmentId),
      );
      setAssignedServices(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách dịch vụ đã chỉ định:", error);
    }
  };

  const loadDataDiagnosis = async () => {
    try {
      const resDisease = await authApis(user.access_token).get(
        endpoint.disease,
      );
      setListDisease(resDisease.data);

      const resAppt = await authApis(user.access_token).get(
        endpoint.update_appointment(appointmentId),
      );
      const apptData = resAppt.data;
      const diseaseObj = apptData.diagnosis;

      setDiagnosisData({
        symptoms: apptData.symptoms || "",
        diseaseId: diseaseObj ? diseaseObj.id : null,
        diseaseName: diseaseObj ? diseaseObj.name : "",
      });
    } catch (error) {
      console.error("Lỗi đồng bộ dữ liệu chẩn đoán bệnh lý:", error);
    }
  };

  // ==========================================
  // 5. LOGIC: VIDEO CALL & STREAM CHAT (Dùng chung cho cả 2 Role)
  // ==========================================
  const callRoomId = `call_${appointmentId}`;
  const handleAudioCall = () =>
    nav.navigate("CallStream", { callId: callRoomId, initialCameraOn: false });
  const handleVideoCall = () =>
    nav.navigate("CallStream", { callId: callRoomId, initialCameraOn: true });

  useEffect(() => {
    let isMounted = true;
    const setupStream = async () => {
      try {
        await authApis(user.access_token).post(
          `${endpoint.appointment}${appointmentId}/chat-rooms/`,
        );
        const res = await authApis(user.access_token).get(endpoint.streamToken);
        const { stream_token, user_id, full_name } = res.data;

        if (chatClient.userID) await chatClient.disconnectUser();
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
        console.error("Lỗi Stream Chat:", error);
      }
    };

    if (user) setupStream();
    return () => {
      isMounted = false;
      if (chatClient?.userID) chatClient.disconnectUser().catch(console.error);
    };
  }, [user, appointmentId]);

  // ==========================================
  // 6. CÁC HÀM XỬ LÝ ACTION CỦA DOCTOR
  // ==========================================
  const handleAddService = async () => {
    if (!serviceData.serviceId) {
      Alert.alert("Lỗi", "Vui lòng chỉ định dịch vụ!");
      return;
    }
    setLoadingAction(true);
    try {
      const payload = {
        service: Number(serviceData.serviceId),
        quantity: Number(serviceData.quantity || 1),
      };
      if (serviceData.detailId) {
        await authApis(user.access_token).patch(
          `/appointment-services/${serviceData.detailId}/`,
          payload,
        );
      } else {
        await authApis(user.access_token).post(
          endpoint.service(appointmentId),
          payload,
        );
      }
      await loadAssignedServices();
      Alert.alert("Thành công", "Ghi nhận dịch vụ y tế thành công.");
      setServiceData({ serviceId: null, quantity: "1", detailId: null });
      setActiveModal(null);
    } catch (error) {
      Alert.alert("Lỗi kết nối", "Không thể hoàn tất thao tác lưu dữ liệu.");
    } finally {
      setLoadingAction(false);
    }
  };

  const reloadSelectedPrescription = async () => {
    /* ... */
  };
  const handleCreateRealPrescription = async () => {
    /* ... */
  };
  const handleTriggerMedicineSearch = async (prescriptionItem) => {
    /* ... */
  };
  const openMedicineInputForm = (med) => {
    /* ... */
  };
  const saveMedicineToPrescription = async (formDetail) => {
    /* ... */ return true;
  };
  const confirmAddMedicine = async () => {
    /* ... */
  };

  const filteredMedicines = useMemo(() => {
    if (!medSearchKw.trim()) return medicines;
    return medicines.filter((m) =>
      m.name.toLowerCase().includes(medSearchKw.toLowerCase()),
    );
  }, [medicines, medSearchKw]);

  const handleSaveDiagnosis = async () => {
    try {
      setLoadingAction(true);
      const payload = {
        symptoms: diagnosisData.symptoms,
        diagnosis: diagnosisData.diseaseId,
      };
      await authApis(user.access_token).patch(
        endpoint.update_appointment(appointmentId),
        payload,
      );
      await loadDataDiagnosis();
      Alert.alert("Thành công", "Đã cập nhật chẩn đoán bệnh nhân.");
      setActiveModal(null);
    } catch (err) {
      Alert.alert("Lỗi", "Không thể hoàn tất thao tác lưu chẩn đoán.");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleSaveResult = async () => {
    setLoadingAction(true);
    const payload = {
      result_type: resultData.result_type,
      result_data: resultData.result_data,
      conclusion: resultData.conclusion,
    };
    console.log("Payload gửi đi:", JSON.stringify(payload, null, 2));
    setLoadingAction(false);
    setActiveModal(null);
  };

  // ==========================================
  // RENDER UI
  // ==========================================
  if (!clientReady || !channel) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#0066FF" />
        <Text style={{ marginTop: 10, color: "#6B7280" }}>
          Đang kết nối phòng khám...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F9FAFB" }}
      edges={["bottom", "left", "right"]}
    >
      <Header
        nav={nav}
        appointmentId={appointmentId}
        onOpenMenu={() => setActionMenuVisible(true)}
        isDevDoctor={user.role === "DOCTOR"}
        onAudioCall={handleAudioCall}
        onVideoCall={handleVideoCall}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 90}
      >
        <Chat client={chatClient}>
          <Channel channel={channel} keyboardBehavior={null}>
            <View style={{ flex: 1 }}>
              <MessageList />
              <MessageComposer />
            </View>
          </Channel>
        </Chat>
      </KeyboardAvoidingView>

      {/* 🌟 FIX: Chỉ render (gắn vào DOM) các Modal xử lý nghiệp vụ nếu User là Bác sĩ */}
      {user?.role === "DOCTOR" && (
        <>
          <DoctorActionSheet
            visible={actionMenuVisible}
            onClose={() => setActionMenuVisible(false)}
            onSelectModal={(modalId) => setActiveModal(modalId)}
          />

          <PrescriptionListModal
            visible={activeModal === "PRESCRIPTION_LIST"}
            prescriptions={prescriptions}
            onClose={() => setActiveModal(null)}
            onSelectPrescription={handleTriggerMedicineSearch}
            onOpenAddForm={handleCreateRealPrescription}
          />

          <MedicineSearchModal
            visible={activeModal === "MEDICINE_SEARCH"}
            selectedPrescription={selectedPrescription}
            loading={loadingMedicines}
            medicines={filteredMedicines}
            searchKw={medSearchKw}
            setSearchKw={setMedSearchKw}
            categories={medicineCategories}
            activeCategory={medCategoryId}
            setActiveCategory={setMedCategoryId}
            onClose={() => setActiveModal(null)}
            onBack={() => setActiveModal("PRESCRIPTION_LIST")}
            onOpenInputForm={openMedicineInputForm}
          />

          <MedicineInputModal
            visible={activeModal === "MEDICINE_INPUT"}
            selectedMed={selectedMedForInput}
            form={medInputForm}
            setForm={setMedInputForm}
            onBack={() => setActiveModal("MEDICINE_SEARCH")}
            onSubmit={confirmAddMedicine}
            loading={loadingAction}
          />

          <ServiceModal
            visible={activeModal === "SERVICE"}
            data={serviceData}
            setData={setServiceData}
            services={listService}
            assignedServices={assignedServices}
            onClose={() => {
              setActiveModal(null);
              setServiceData({
                serviceId: null,
                quantity: "1",
                detailId: null,
              });
            }}
            onSubmit={handleAddService}
            loading={loadingAction}
          />

          <DiagnosisModal
            visible={activeModal === "DIAGNOSIS"}
            data={diagnosisData}
            setData={setDiagnosisData}
            diseases={listDisease}
            onClose={() => setActiveModal(null)}
            onSubmit={handleSaveDiagnosis}
            loading={loadingAction}
          />

          <ResultModal
            visible={activeModal === "RESULT"}
            data={resultData}
            setData={setResultData}
            onClose={() => setActiveModal(null)}
            onSubmit={() => handleSaveResult()}
            loading={loadingAction}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default ChatStream;
