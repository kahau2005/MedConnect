import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

// ==========================================
// COMPONENT CHÍNH: PATIENT PROFILE TAB (TAB NGƯỜI DÙNG)
// ==========================================
const PatientProfileTab = () => {
  // --- MOCK STATES BẬT/TẮT ĐỂ TEST UI ---
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Đổi thành true để xem view đã đăng nhập
  const [hasProfile, setHasProfile] = useState(false); // Đổi thành true để xem view đã có hồ sơ y tế

  const [isEditing, setIsEditing] = useState(false); // Trạng thái đang mở form Tạo/Sửa

  // State Form
  const [formData, setFormData] = useState({
    fullName: hasProfile ? "Phạm Minh Hậu" : "",
    dob: hasProfile ? "15/05/2004" : "",
    gender: hasProfile ? "MALE" : "MALE",
    bloodType: hasProfile ? "O+" : "",
    height: hasProfile ? "175" : "",
    weight: hasProfile ? "65" : "",
    allergies: hasProfile ? "Không có" : "",
    medicalHistory: hasProfile ? "Không có" : "",
  });

  const genders = [
    { id: "MALE", label: "Nam" },
    { id: "FEMALE", label: "Nữ" },
    { id: "OTHER", label: "Khác" },
  ];

  // Xử lý Lưu / Cập nhật
  const handleSave = () => {
    console.log(
      hasProfile
        ? "PATCH /users/current-user/patient-profile/"
        : "POST /appointments/ (Tạo profile)",
    );
    console.log("Data:", formData);
    setHasProfile(true); // Giả lập đã tạo thành công
    setIsEditing(false); // Đóng form
  };

  // ----------------------------------------------------
  // VIEW 1: CHƯA ĐĂNG NHẬP
  // ----------------------------------------------------
  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tài khoản</Text>
        </View>
        <View style={styles.guestContainer}>
          <View style={styles.guestIconBg}>
            <Feather name="shield" size={48} color="#0066FF" />
          </View>
          <Text style={styles.guestTitle}>
            Chào mừng bạn đến với MedConnect
          </Text>
          <Text style={styles.guestSub}>
            Vui lòng đăng nhập hoặc tạo tài khoản để quản lý hồ sơ y tế và đặt
            lịch khám cùng bác sĩ.
          </Text>
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.8}
            onPress={() => setIsLoggedIn(true)} // Mock đăng nhập
          >
            <Text style={styles.primaryBtnText}>Đăng nhập</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.outlineBtn} activeOpacity={0.8}>
            <Text style={styles.outlineBtnText}>Đăng ký tài khoản</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ----------------------------------------------------
  // VIEW 2: FORM TẠO MỚI / CHỈNH SỬA HỒ SƠ Y TẾ
  // ----------------------------------------------------
  if (isEditing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setIsEditing(false)}
          >
            <Feather name="arrow-left" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {hasProfile ? "Cập nhật hồ sơ y tế" : "Tạo hồ sơ y tế"}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.formScroll}
          >
            {!hasProfile && (
              <View style={styles.alertBox}>
                <Feather name="alert-circle" size={20} color="#E11D48" />
                <Text style={styles.alertText}>
                  Vui lòng tạo hồ sơ bệnh nhân trước khi đặt lịch khám. Hồ sơ
                  này giúp bác sĩ chẩn đoán chính xác hơn.
                </Text>
              </View>
            )}

            <View style={styles.formCard}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons
                  name="card-account-details-outline"
                  size={20}
                  color="#4B5563"
                />
                <Text style={styles.cardTitle}>Thông tin hành chính</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Họ và tên <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập họ và tên"
                  value={formData.fullName}
                  onChangeText={(text) =>
                    setFormData({ ...formData, fullName: text })
                  }
                />
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                  <Text style={styles.inputLabel}>
                    Ngày sinh <Text style={styles.required}>*</Text>
                  </Text>
                  <TouchableOpacity style={styles.datePickerBtn}>
                    <Text
                      style={
                        formData.dob ? styles.dateText : styles.placeholderText
                      }
                    >
                      {formData.dob || "DD/MM/YYYY"}
                    </Text>
                    <Feather name="calendar" size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>
                    Giới tính <Text style={styles.required}>*</Text>
                  </Text>
                  <View style={styles.genderRow}>
                    {genders.map((g) => (
                      <TouchableOpacity
                        key={g.id}
                        style={[
                          styles.genderBtn,
                          formData.gender === g.id && styles.genderBtnActive,
                        ]}
                        onPress={() =>
                          setFormData({ ...formData, gender: g.id })
                        }
                      >
                        <Text
                          style={[
                            styles.genderText,
                            formData.gender === g.id && styles.genderTextActive,
                          ]}
                        >
                          {g.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.formCard}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons
                  name="human-male-height"
                  size={20}
                  color="#4B5563"
                />
                <Text style={styles.cardTitle}>Chỉ số cơ thể</Text>
              </View>
              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                  <Text style={styles.inputLabel}>Chiều cao (cm)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="170"
                    keyboardType="numeric"
                    value={formData.height}
                    onChangeText={(text) =>
                      setFormData({ ...formData, height: text })
                    }
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                  <Text style={styles.inputLabel}>Cân nặng (kg)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="65"
                    keyboardType="numeric"
                    value={formData.weight}
                    onChangeText={(text) =>
                      setFormData({ ...formData, weight: text })
                    }
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Nhóm máu</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="O, A..."
                    autoCapitalize="characters"
                    value={formData.bloodType}
                    onChangeText={(text) =>
                      setFormData({ ...formData, bloodType: text })
                    }
                  />
                </View>
              </View>
            </View>

            <View style={styles.formCard}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons
                  name="medical-bag"
                  size={20}
                  color="#4B5563"
                />
                <Text style={styles.cardTitle}>Tiền sử y tế</Text>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tiền sử dị ứng</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Thuốc, thức ăn..."
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  value={formData.allergies}
                  onChangeText={(text) =>
                    setFormData({ ...formData, allergies: text })
                  }
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Bệnh lý nền</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Cao huyết áp, Tiểu đường..."
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  value={formData.medicalHistory}
                  onChangeText={(text) =>
                    setFormData({ ...formData, medicalHistory: text })
                  }
                />
              </View>
            </View>
            <View style={{ height: 100 }} />
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.saveBtnText}>
              {hasProfile ? "Cập nhật hồ sơ" : "Lưu hồ sơ"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ----------------------------------------------------
  // VIEW 3: ĐÃ ĐĂNG NHẬP (TRANG CHỦ CỦA TAB TÀI KHOẢN)
  // ----------------------------------------------------
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tài khoản</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Info Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: "https://getstream.io/random_svg/?name=Hau" }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.userName}>
            {hasProfile ? formData.fullName : "Người dùng mới"}
          </Text>
          <Text style={styles.userEmail}>user@example.com</Text>
        </View>

        <View style={styles.mainContent}>
          {/* NẾU CHƯA CÓ HỒ SƠ: HIỆN CẢNH BÁO BẮT BUỘC TẠO */}
          {!hasProfile ? (
            <View style={styles.missingProfileCard}>
              <View style={styles.missingProfileHeader}>
                <View style={styles.warningIconBg}>
                  <Feather name="alert-triangle" size={24} color="#E11D48" />
                </View>
                <Text style={styles.missingProfileTitle}>
                  Chưa có hồ sơ y tế
                </Text>
              </View>
              <Text style={styles.missingProfileDesc}>
                Bạn cần tạo hồ sơ bệnh nhân trước khi sử dụng tính năng đặt lịch
                khám và nhận tư vấn từ bác sĩ.
              </Text>
              <TouchableOpacity
                style={styles.createProfileBtn}
                onPress={() => setIsEditing(true)}
              >
                <MaterialCommunityIcons
                  name="clipboard-plus-outline"
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.createProfileBtnText}>
                  Tạo hồ sơ y tế ngay
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* NẾU ĐÃ CÓ HỒ SƠ: HIỆN THÔNG TIN + NÚT SỬA */
            <View style={styles.profileDataCard}>
              <View style={styles.profileDataHeader}>
                <Text style={styles.profileDataTitle}>
                  Hồ sơ bệnh nhân (Patient Profile)
                </Text>
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  style={styles.editBtn}
                >
                  <Feather name="edit-2" size={16} color="#0066FF" />
                  <Text style={styles.editBtnText}>Sửa</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dataGrid}>
                <View style={styles.dataItem}>
                  <Text style={styles.dataLabel}>Ngày sinh</Text>
                  <Text style={styles.dataValue}>{formData.dob}</Text>
                </View>
                <View style={styles.dataItem}>
                  <Text style={styles.dataLabel}>Giới tính</Text>
                  <Text style={styles.dataValue}>
                    {formData.gender === "MALE"
                      ? "Nam"
                      : formData.gender === "FEMALE"
                        ? "Nữ"
                        : "Khác"}
                  </Text>
                </View>
                <View style={styles.dataItem}>
                  <Text style={styles.dataLabel}>Nhóm máu</Text>
                  <Text style={styles.dataValue}>
                    {formData.bloodType || "--"}
                  </Text>
                </View>
                <View style={styles.dataItem}>
                  <Text style={styles.dataLabel}>Thể trạng</Text>
                  <Text style={styles.dataValue}>
                    {formData.height}cm / {formData.weight}kg
                  </Text>
                </View>
              </View>

              <View style={styles.dataRowFull}>
                <Text style={styles.dataLabel}>Dị ứng</Text>
                <Text style={styles.dataValueFull}>{formData.allergies}</Text>
              </View>
              <View style={styles.dataRowFull}>
                <Text style={styles.dataLabel}>Bệnh lý nền</Text>
                <Text style={styles.dataValueFull}>
                  {formData.medicalHistory}
                </Text>
              </View>
            </View>
          )}

          {/* Các Menu khác */}
          <View style={styles.menuList}>
            <TouchableOpacity style={styles.menuItem}>
              <Feather name="settings" size={22} color="#4B5563" />
              <Text style={styles.menuItemText}>Cài đặt tài khoản</Text>
              <Feather name="chevron-right" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setIsLoggedIn(false)}
            >
              <Feather name="log-out" size={22} color="#EF4444" />
              <Text style={[styles.menuItemText, { color: "#EF4444" }]}>
                Đăng xuất
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F9" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  backBtn: { width: 40, height: 40, justifyContent: "center" },

  // GUEST VIEW (CHƯA ĐĂNG NHẬP)
  guestContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "#FFFFFF",
  },
  guestIconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F0F5FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  guestTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
  },
  guestSub: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  primaryBtn: {
    width: "100%",
    backgroundColor: "#0066FF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  primaryBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  outlineBtn: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  outlineBtnText: { color: "#374151", fontSize: 16, fontWeight: "600" },

  // USER TAB (ĐÃ ĐĂNG NHẬP)
  profileHeader: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 30,
  },
  avatarContainer: { marginBottom: 12 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#F0F5FF",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  userEmail: { fontSize: 14, color: "#6B7280" },

  mainContent: { padding: 16 },

  missingProfileCard: {
    backgroundColor: "#FFF1F2",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#FECDD3",
    marginBottom: 20,
  },
  missingProfileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  warningIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFE4E6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  missingProfileTitle: { fontSize: 18, fontWeight: "bold", color: "#BE123C" },
  missingProfileDesc: {
    fontSize: 14,
    color: "#9F1239",
    lineHeight: 20,
    marginBottom: 20,
  },
  createProfileBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E11D48",
    paddingVertical: 14,
    borderRadius: 12,
  },
  createProfileBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 8,
  },

  profileDataCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  profileDataHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingBottom: 16,
    marginBottom: 16,
  },
  profileDataTitle: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F5FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editBtnText: {
    color: "#0066FF",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 4,
  },

  dataGrid: { flexDirection: "row", flexWrap: "wrap", marginBottom: 8 },
  dataItem: { width: "50%", marginBottom: 16 },
  dataLabel: { fontSize: 12, color: "#6B7280", marginBottom: 4 },
  dataValue: { fontSize: 14, fontWeight: "600", color: "#111827" },
  dataRowFull: { marginBottom: 16 },
  dataValueFull: {
    fontSize: 14,
    color: "#374151",
    backgroundColor: "#F9FAFB",
    padding: 10,
    borderRadius: 8,
    marginTop: 4,
    overflow: "hidden",
  },

  menuList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  menuItemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#374151",
    marginLeft: 16,
  },

  // FORM TẠO/SỬA
  formScroll: { padding: 16 },
  alertBox: {
    flexDirection: "row",
    backgroundColor: "#FFF1F2",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FECDD3",
  },
  alertText: {
    flex: 1,
    fontSize: 13,
    color: "#BE123C",
    marginLeft: 8,
    lineHeight: 18,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingBottom: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginLeft: 8,
  },
  inputGroup: { marginBottom: 16 },
  rowInputs: { flexDirection: "row", justifyContent: "space-between" },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  required: { color: "#EF4444" },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
    fontSize: 15,
    color: "#111827",
  },
  textArea: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
    minHeight: 80,
    fontSize: 15,
    color: "#111827",
  },
  datePickerBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
  },
  dateText: { fontSize: 15, color: "#111827" },
  placeholderText: { fontSize: 15, color: "#9CA3AF" },
  genderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 4,
  },
  genderBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  genderBtnActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  genderText: { fontSize: 13, fontWeight: "500", color: "#6B7280" },
  genderTextActive: { color: "#111827", fontWeight: "700" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  saveBtn: {
    backgroundColor: "#0066FF",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
});

export default PatientProfileTab;
