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

import { StreamChat } from "stream-chat";
import { Chat, Channel, MessageList, MessageComposer } from "stream-chat-expo";

import { UserContext } from "../../contexts/UserContext";
import Apis, { authApis, endpoint } from "../../configs/Apis";

import Header from "../../components/ChatStream/Header";
import DoctorActionSheet from "../../components/ChatStream/DoctorActionSheet";
import PrescriptionListModal from "../../components/ChatStream/PrescriptionListModal";
import MedicineSearchModal from "../../components/ChatStream/MedicineSearchModal";
import MedicineInputModal from "../../components/ChatStream/MedicineInputModal";
import ServiceModal from "../../components/ChatStream/ServiceModal";
import ResultModal from "../../components/ChatStream/ResultModal";
import DiagnosisModal from "../../components/ChatStream/DiagnosisModal";

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
  const nav = useNavigation();
  const route = useRoute();
  const appointmentId = route.params?.appointmentId || 1;
  const status = route.params?.status || "SCHEDULED";
  const [user] = useContext(UserContext);
  const [actionMenuVisible, setActionMenuVisible] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);

  const [channel, setChannel] = useState(null);
  const [clientReady, setClientReady] = useState(false);
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

  useEffect(() => {
    if (user) {
      handleUpdateAppointmentStatus();
      getListPrescriptions();
      loadMedicineCategories();
      loadService();
      loadAssignedServices();
      loadDataDiagnosis();
    }
  }, [user]);

  const handleUpdateAppointmentStatus = async () => {
    if (!user || user.role !== "DOCTOR" || status === "PENDING") return;
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
      console.error(
        "Lỗi đồng bộ dịch vụ khám:",
        error.response?.data || error.message,
      );
      Alert.alert("Lỗi kết nối", "Không thể hoàn tất thao tác lưu dữ liệu.");
    } finally {
      setLoadingAction(false);
    }
  };

  const reloadSelectedPrescription = async () => {
    if (!selectedPrescription) return;
    try {
      const res = await authApis(user.access_token).get(
        endpoint.prescription(appointmentId),
      );
      setPrescriptions(res.data);
      const updated = res.data.find((p) => p.id === selectedPrescription.id);
      if (updated) setSelectedPrescription(updated);
    } catch (error) {
      console.error("Lỗi reload đơn thuốc:", error);
    }
  };

  const handleCreateRealPrescription = async () => {
    try {
      const res = await authApis(user.access_token).post(
        endpoint.prescription(appointmentId),
      );
      const newPrescriptionObj = res.data;
      setPrescriptions((prev) => [newPrescriptionObj, ...prev]);
      handleTriggerMedicineSearch(newPrescriptionObj);
    } catch (error) {
      console.error("Lỗi khi gọi API tạo đơn thuốc:", error);
    }
  };

  const handleTriggerMedicineSearch = async (prescriptionItem) => {
    setSelectedPrescription(prescriptionItem);
    setActiveModal("MEDICINE_SEARCH");
    setLoadingMedicines(true);
    try {
      const res = await authApis(user.access_token).get(endpoint.medicines);
      setMedicines(res.data);
    } catch (error) {
      console.log("Lỗi tải API thuốc:", error);
    } finally {
      setLoadingMedicines(false);
    }
  };

  const openMedicineInputForm = (med) => {
    setSelectedMedForInput(med);
    if (med.detailId) {
      setMedInputForm({
        medicine: med.medicine?.id || med.id,
        detailId: med.detailId,
        quantity: String(med.quantity ?? "1"),
        dose: String(med.dose || "1"),
        frequency: String(med.frequency || "2"),
        duration_day: String(med.duration_day || "7"),
        instruction: med.instruction || "AFTER_MEAL",
      });
      setActiveModal("MEDICINE_INPUT");
      return;
    }

    const targetMedicineId = med.id;
    const details = selectedPrescription?.details || [];
    const matchedDetails = details.filter(
      (d) => Number(d.medicine?.id) === Number(targetMedicineId),
    );
    const existingDetail =
      matchedDetails.length > 0
        ? matchedDetails.reduce((a, b) => (a.id > b.id ? a : b))
        : null;

    if (existingDetail) {
      setMedInputForm({
        medicine: targetMedicineId,
        detailId: existingDetail.id,
        quantity: String(existingDetail.quantity),
        text: String(existingDetail.dose || "1"),
        frequency: String(existingDetail.frequency || "2"),
        duration_day: String(existingDetail.duration_day || "7"),
        instruction: existingDetail.instruction || "AFTER_MEAL",
      });
    } else {
      setMedInputForm({ ...EMPTY_MED_FORM, medicine: targetMedicineId });
    }
    setActiveModal("MEDICINE_INPUT");
  };

  const saveMedicineToPrescription = async (formDetail) => {
    try {
      const basePayload = {
        quantity: Number(formDetail.quantity || 0),
        dose: Number(formDetail.dose || 1),
        frequency: Number(formDetail.frequency || 1),
        duration_day: Number(formDetail.duration_day || 1),
        instruction: formDetail.instruction || "AFTER_MEAL",
      };

      if (formDetail.detailId) {
        await authApis(user.access_token).patch(
          endpoint.update_medicine(formDetail.detailId),
          { medicine: Number(formDetail.medicine), ...basePayload },
        );
      } else {
        await authApis(user.access_token).post(
          endpoint.add_medicine(selectedPrescription.id),
          [{ medicine: Number(formDetail.medicine), ...basePayload }],
        );
      }
      return true;
    } catch (error) {
      console.error("Lỗi khi xử lý lưu thuốc:", error);
      return false;
    }
  };

  const confirmAddMedicine = async () => {
    const qty = parseInt(medInputForm.quantity);
    if (!medInputForm.quantity || isNaN(qty) || qty <= 0) {
      Alert.alert("Lỗi", "Số lượng thuốc không hợp lệ!");
      return;
    }
    setLoadingAction(true);
    const isSuccess = await saveMedicineToPrescription(medInputForm);
    if (isSuccess) {
      await reloadSelectedPrescription();
      setActiveModal("MEDICINE_SEARCH");
    }
    setLoadingAction(false);
  };

  const filteredMedicines = useMemo(() => {
    if (!medSearchKw.trim()) return medicines;
    const lowerKw = medSearchKw.toLowerCase();
    return medicines.filter((m) => m.name.toLowerCase().includes(lowerKw));
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
      console.error(
        "Lỗi cập nhật chẩn đoán bệnh lý:",
        err.response?.data || err.message,
      );
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

  const executeMockAction = (successMsg) => {
    setLoadingAction(true);
    setTimeout(() => {
      setLoadingAction(false);
      Alert.alert("Thành công (Dữ liệu mẫu)", successMsg);
      setActiveModal(null);
    }, 800);
  };

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
          setServiceData({ serviceId: null, quantity: "1", detailId: null });
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
    </SafeAreaView>
  );
};

export default ChatStream;
