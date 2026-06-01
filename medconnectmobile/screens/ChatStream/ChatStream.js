import React, { useContext, useState, useEffect } from "react";
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
import { authApis, endpoint, STREAM_API } from "../../configs/Apis";

import Header from "../../components/ChatStream/Header";
import DoctorActionSheet from "../../components/ChatStream/DoctorActionSheet";
import PrescriptionListModal from "../../components/ChatStream/PrescriptionListModal";
import MedicineSearchModal from "../../components/ChatStream/MedicineSearchModal";
import MedicineInputModal from "../../components/ChatStream/MedicineInputModal";
import ServiceModal from "../../components/ChatStream/ServiceModal";
import ResultModal from "../../components/ChatStream/ResultModal";
import DiagnosisModal from "../../components/ChatStream/DiagnosisModal";

const chatClient = StreamChat.getInstance(STREAM_API);

const ChatStream = () => {
  const nav = useNavigation();
  const route = useRoute();
  const appointmentId = route.params?.appointmentId;
  const status = route.params?.status || "SCHEDULED";
  const [user] = useContext(UserContext);

  const [actionMenuVisible, setActionMenuVisible] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);

  const [channel, setChannel] = useState(null);
  const [clientReady, setClientReady] = useState(false);

  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [selectedMedForInput, setSelectedMedForInput] = useState(null);

  useEffect(() => {
    if (user && user.role === "DOCTOR" && status !== "PENDING") {
      const handleUpdateAppointmentStatus = async () => {
        try {
          await authApis(user.access_token).patch(
            `${endpoint.appointment}${appointmentId}/`,
            { status: "PENDING" },
          );
        } catch (error) {
          const errData = error?.response?.data?.err;
          const errorMessage = Array.isArray(errData)
            ? errData[0]
            : errData || "Không xác định!";
          Alert.alert("Lỗi", errorMessage);
        }
      };
      handleUpdateAppointmentStatus();
    }
  }, [user]);

  const callRoomId = `call_${appointmentId}`;
  const handleAudioCall = () =>
    nav.navigate("CallStream", { callId: callRoomId, initialCameraOn: false });
  const handleVideoCall = () =>
    nav.navigate("CallStream", { callId: callRoomId, initialCameraOn: true });

  const handlePatientPayment = () => {
    nav.navigate("Payment", { appointmentId: appointmentId });
  };

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

        const channelId = `appointment_${Number(appointmentId) + 700}`;
        const currentChannel = chatClient.channel("messaging", channelId);
        await currentChannel.watch();

        if (isMounted) {
          setChannel(currentChannel);
          setClientReady(true);
        }
      } catch (error) {
        const errData = error?.response?.data?.err;
        const errorMessage = Array.isArray(errData)
          ? errData[0]
          : errData || "Không xác định!";
        Alert.alert("Lỗi", errorMessage);
      }
    };

    if (user) setupStream();
    return () => {
      isMounted = false;
      if (chatClient?.userID) chatClient.disconnectUser().catch(console.error);
    };
  }, [user, appointmentId]);

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
        isDevDoctor={user?.role === "DOCTOR"}
        onOpenMenu={() => setActionMenuVisible(true)}
        onAudioCall={handleAudioCall}
        onVideoCall={handleVideoCall}
        onPayment={handlePatientPayment}
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

      {user?.role === "DOCTOR" && (
        <>
          <DoctorActionSheet
            visible={actionMenuVisible}
            onClose={() => setActionMenuVisible(false)}
            onSelectModal={(modalId) => setActiveModal(modalId)}
          />

          <DiagnosisModal
            visible={activeModal === "DIAGNOSIS"}
            onClose={() => setActiveModal(null)}
            appointmentId={appointmentId}
          />

          <ResultModal
            visible={activeModal === "RESULT"}
            onClose={() => setActiveModal(null)}
            appointmentId={appointmentId}
          />

          <ServiceModal
            visible={activeModal === "SERVICE"}
            onClose={() => setActiveModal(null)}
            appointmentId={appointmentId}
          />

          <PrescriptionListModal
            visible={activeModal === "PRESCRIPTION_LIST"}
            appointmentId={appointmentId}
            onClose={() => setActiveModal(null)}
            onSelectPrescription={(prescription) => {
              setSelectedPrescription(prescription);
              setActiveModal("MEDICINE_SEARCH");
            }}
          />

          <MedicineSearchModal
            visible={activeModal === "MEDICINE_SEARCH"}
            selectedPrescription={selectedPrescription}
            setSelectedPrescription={setSelectedPrescription}
            onClose={() => setActiveModal(null)}
            onBack={() => setActiveModal("PRESCRIPTION_LIST")}
            onOpenInputForm={(medicineItem) => {
              setSelectedMedForInput(medicineItem);
              setActiveModal("MEDICINE_INPUT");
            }}
          />

          <MedicineInputModal
            visible={activeModal === "MEDICINE_INPUT"}
            selectedPrescription={selectedPrescription}
            setSelectedPrescription={setSelectedPrescription}
            selectedMed={selectedMedForInput}
            onClose={() => setActiveModal(null)}
            onBack={() => setActiveModal("MEDICINE_SEARCH")}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default ChatStream;
