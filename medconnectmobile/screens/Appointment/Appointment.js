import React, { useEffect, useState, useRef, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { DatePickerInput, TimePickerModal } from "react-native-paper-dates";
import { useNavigation } from "@react-navigation/native";

import SelectorModal from "../../components/SelectorModel/SelectorModal";
import Apis, { authApis, endpoint } from "../../configs/Apis";
import { UserContext } from "../../contexts/UserContext";
import LoadingModal from "../../components/LoadingModel/LoadingModel";

const Appointment = () => {
  const [inputDate, setInputDate] = useState(undefined);
  const [showTime, setShowTime] = useState(false);
  const [inputTime, setInputTime] = useState(undefined);
  const [symptoms, setSymptoms] = useState("");
  const navigation = useNavigation();

  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [specialtyModalVisible, setSpecialtyModalVisible] = useState(false);
  const [doctorModalVisible, setDoctorModalVisible] = useState(false);

  const [specialties, setSpecialties] = useState([]);
  const [specLoading, setSpecLoading] = useState(false);
  const [specOffset, setSpecOffset] = useState(0);
  const [specHasMore, setSpecHasMore] = useState(true);
  const isSpecLoadingRef = useRef(false);

  const [doctors, setDoctors] = useState([]);
  const [docLoading, setDocLoading] = useState(false);
  const [docOffset, setDocOffset] = useState(0);
  const [docHasMore, setDocHasMore] = useState(true);
  const isDocLoadingRef = useRef(false);

  const [loading, setLoading] = useState(false);

  const [user] = useContext(UserContext);

  const loadSpecialty = async (isLoadMore = false) => {
    if (isSpecLoadingRef.current || (!specHasMore && isLoadMore)) return;

    isSpecLoadingRef.current = true;
    setSpecLoading(true);

    try {
      const currentOffset = isLoadMore ? specOffset + 10 : 0;
      const res = await Apis.get(
        `${endpoint.specialties}?limit=10&offset=${currentOffset}`,
      );

      const newData = res.data.results || res.data;
      if (isLoadMore) {
        setSpecialties((prev) => [...prev, ...newData]);
        setSpecOffset(currentOffset);
      } else {
        setSpecialties(newData);
        setSpecOffset(0);
      }

      setSpecHasMore(!!res.data.next);
    } catch (error) {
      console.error("Lỗi tải chuyên khoa:", error);
    } finally {
      isSpecLoadingRef.current = false;
      setSpecLoading(false);
    }
  };

  const loadDoctors = async (isLoadMore = false) => {
    if (isDocLoadingRef.current || (!docHasMore && isLoadMore)) return;

    isDocLoadingRef.current = true;
    setDocLoading(true);

    try {
      const currentOffset = isLoadMore ? docOffset + 10 : 0;
      let url = `${endpoint.doctors}?limit=10&offset=${currentOffset}`;
      if (selectedSpecialty) {
        url += `&specialty_id=${selectedSpecialty.id}`;
      }

      const res = await Apis.get(url);
      const newData = res.data.results || [];

      if (isLoadMore) {
        setDoctors((prev) => [...prev, ...newData]);
        setDocOffset(currentOffset);
      } else {
        setDoctors(newData);
        setDocOffset(0);
      }

      setDocHasMore(!!res.data.next);
    } catch (error) {
      console.error("Lỗi tải danh sách bác sĩ:", error);
    } finally {
      isDocLoadingRef.current = false;
      setDocLoading(false);
    }
  };

  const handleCreateAppointment = async () => {
    if (!user || !user.access_token) {
      Alert.alert("Lỗi", "Vui lòng đăng nhập lại!");
      return;
    }

    if (!selectedDoctor || !inputDate || !inputTime) {
      Alert.alert(
        "Thiếu thông tin",
        "Vui lòng chọn đầy đủ Bác sĩ, Ngày và Giờ khám.",
      );
      return;
    }

    try {
      setLoading(true);

      const year = inputDate.getFullYear();
      const month = String(inputDate.getMonth() + 1).padStart(2, "0");
      const day = String(inputDate.getDate()).padStart(2, "0");

      const hours = String(inputTime.hours).padStart(2, "0");
      const minutes = String(inputTime.minutes).padStart(2, "0");

      const startDateTime = `${year}-${month}-${day} ${hours}:${minutes}:00`;

      const payload = {
        doctor: selectedDoctor.user_id || selectedDoctor.id,
        start: startDateTime,
        reason: symptoms,
        diagnosis: 2,
      };
      const res = await authApis(user.access_token).post(
        endpoint.appointment,
        payload,
      );

      console.log("Thành công!", res.data);
      Alert.alert("Thành công", "Đặt lịch khám thành công!");
    } catch (error) {
      const errorMsg = error.response?.data?.start?.[0]
        ? JSON.stringify(error.response.data.start[0])
        : "Không thể kết nối máy chủ";

      Alert.alert("Đặt lịch thất bại", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpecialty(false);
  }, []);

  useEffect(() => {
    setDocHasMore(true);
    loadDoctors(false);
  }, [selectedSpecialty]);

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="medical" size={20} color="#0066FF" />
            <Text style={styles.cardTitle}>Thông tin bác sĩ</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Chuyên khoa</Text>
            <TouchableOpacity
              style={styles.dropdownSelector}
              onPress={() => setSpecialtyModalVisible(true)}
            >
              <Text
                style={
                  selectedSpecialty ? styles.valueText : styles.placeholderText
                }
              >
                {selectedSpecialty
                  ? selectedSpecialty.name
                  : "Chọn chuyên khoa"}
              </Text>
              <Feather name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bác sĩ điều trị</Text>
            <TouchableOpacity
              style={styles.dropdownSelector}
              onPress={() => setDoctorModalVisible(true)}
              disabled={!selectedSpecialty}
            >
              <Text
                style={
                  selectedDoctor ? styles.valueText : styles.placeholderText
                }
              >
                {selectedDoctor
                  ? `${selectedDoctor.first_name} ${selectedDoctor.last_name}`
                  : "Chọn bác sĩ"}
              </Text>
              <Feather name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="calendar" size={20} color="#0066FF" />
            <Text style={styles.cardTitle}>Thời gian hẹn</Text>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Ngày khám</Text>
              <View style={styles.datePickerContainer}>
                <DatePickerInput
                  locale="vi"
                  value={inputDate}
                  onChange={(d) => setInputDate(d)}
                  withDateFormatInLabel={false}
                  style={styles.paperInput}
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  cursorColor="#0066FF"
                />
              </View>
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.label}>Giờ khám</Text>
              <TouchableOpacity
                style={styles.timeSelector}
                onPress={() => setShowTime(true)}
              >
                <Text
                  style={inputTime ? styles.valueText : styles.placeholderText}
                >
                  {inputTime
                    ? `${inputTime.hours}:${inputTime.minutes < 10 ? "0" + inputTime.minutes : inputTime.minutes}`
                    : "Chọn giờ"}
                </Text>
                <Feather name="clock" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <TimePickerModal
            visible={showTime}
            onDismiss={() => setShowTime(false)}
            onConfirm={({ hours, minutes }) => {
              setShowTime(false);
              setInputTime({ hours, minutes });
            }}
            hours={12}
            minutes={0}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="file-text" size={20} color="#0066FF" />
            <Text style={styles.cardTitle}>Tình trạng sức khỏe</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mô tả triệu chứng (Tùy chọn)</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Vui lòng mô tả chi tiết các triệu chứng bạn đang gặp phải..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={symptoms}
              onChangeText={setSymptoms}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleCreateAppointment}
        >
          <Text style={styles.submitButtonText}>Xác nhận đặt hẹn</Text>
        </TouchableOpacity>
      </View>

      <SelectorModal
        visible={specialtyModalVisible}
        onClose={() => setSpecialtyModalVisible(false)}
        title="Chọn Chuyên Khoa"
        placeholder="Tìm chuyên khoa..."
        data={specialties}
        isLoading={specLoading}
        hasMore={specHasMore}
        onLoadMore={() => loadSpecialty(true)}
        displayFieldRow="name"
        onSelect={(item) => {
          setSelectedSpecialty(item);
          setSelectedDoctor(null);
        }}
      />

      <SelectorModal
        visible={doctorModalVisible}
        onClose={() => setDoctorModalVisible(false)}
        title="Chọn Bác Sĩ Điều Trị"
        placeholder="Tìm tên bác sĩ..."
        data={doctors}
        isLoading={docLoading}
        hasMore={docHasMore}
        onLoadMore={() => loadDoctors(true)}
        displayFieldRow={(item) => `${item.first_name} ${item.last_name}`}
        onSelect={(item) => setSelectedDoctor(item)}
      />
      {loading && <LoadingModal />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingTop: 24, paddingBottom: 40 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginLeft: 8,
  },
  inputGroup: { marginBottom: 16 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  label: { fontSize: 13, fontWeight: "500", color: "#666666", marginBottom: 8 },
  dropdownSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
  },
  timeSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  datePickerContainer: {
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    overflow: "hidden",
    height: 52,
    justifycontent: "center",
  },
  paperInput: { backgroundColor: "transparent", height: 52, fontSize: 14 },
  placeholderText: { color: "#999999", fontSize: 14 },
  valueText: { color: "#333333", fontSize: 14, fontWeight: "500" },
  textArea: {
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 14,
    color: "#333333",
    minHeight: 100,
  },
  footer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === "ios" ? 20 : 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  submitButton: {
    backgroundColor: "#0066FF",
    borderRadius: 12,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0066FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
});

export default Appointment;
