import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Image,
  Alert,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Style from "./Style";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../../../../contexts/UserContext";
import { authApis, endpoint } from "../../../../configs/Apis";
import DateTimePicker from "@react-native-community/datetimepicker";
import LoadingModal from "../../../../components/LoadingModel/LoadingModel";
import LoginPanel from "../../../../components/LoginPanel/LoginPanel";
import { unregisterDevice } from "../../../../configs/FCMService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PatientProfileTab = () => {
  const nav = useNavigation();

  const [hasProfile, setHasProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [user, dispatch] = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const initialFormData = {
    dob: "",
    gender: "MALE",
    blood_type: "",
    height: "",
    weight: "",
    allergies: "",
    chronic_diseases: "",
    address: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBloodTypeModal, setShowBloodTypeModal] = useState(false);
  const bloodTypes = ["A", "B", "AB", "O"];

  const genders = [
    { id: "MALE", label: "Nam" },
    { id: "FEMALE", label: "Nữ" },
  ];

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      setFormData({ ...formData, dob: `${year}-${month}-${day}` });
    }
  };

  const fetchData = async () => {
    if (!user || !user.access_token) {
      setHasProfile(false);
      setFormData(initialFormData);
      return;
    }

    try {
      setLoading(true);
      const profileRes = await authApis(user.access_token).get(
        endpoint.patient_profile,
      );

      if (profileRes.data && profileRes.data.active) {
        setHasProfile(true);
        setFormData({
          dob: profileRes.data.dob || "",
          gender: profileRes.data.gender || "MALE",
          blood_type: profileRes.data.blood_type || "",
          height: profileRes.data.height
            ? profileRes.data.height.toString()
            : "",
          weight: profileRes.data.weight
            ? profileRes.data.weight.toString()
            : "",
          allergies: profileRes.data.allergies || "",
          chronic_diseases: profileRes.data.chronic_diseases || "",
          address: profileRes.data.address || "",
        });
      }
    } catch (err) {
      if (err.response?.status === 404 || err.status === 404) {
        setHasProfile(false);
        setFormData(initialFormData);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleSave = async () => {
    try {
      setLoading(true);

      const payload = {
        dob: formData.dob.trim() || null,
        gender: formData.gender,
        blood_type: formData.blood_type.trim() || null,
        height: formData.height ? parseInt(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        allergies: formData.allergies.trim() || null,
        chronic_diseases: formData.chronic_diseases.trim() || null,
        address: formData.address.trim() || null,
      };

      if (hasProfile) {
        await authApis(user.access_token).patch(
          endpoint.patient_profile,
          payload,
        );
      } else {
        await authApis(user.access_token).post(
          endpoint.patient_profile,
          payload,
        );
      }

      setHasProfile(true);
      setIsEditing(false);
    } catch (error) {
      Alert.alert("Lỗi", error?.response?.data?.err || "Không xác định!");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <LoginPanel
        headerTitle="Tài khoản"
        title="Chào mừng bạn đến với MedConnect"
        subtitle="Vui lòng đăng nhập hoặc tạo tài khoản để quản lý hồ sơ y tế và đặt lịch khám cùng bác sĩ."
      />
    );
  }

  if (isEditing) {
    return (
      <SafeAreaView style={Style.container}>
        <View style={Style.header}>
          <TouchableOpacity
            style={Style.backBtn}
            onPress={() => setIsEditing(false)}
          >
            <Feather name="arrow-left" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={Style.headerTitle}>
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
            contentContainerStyle={Style.formScroll}
          >
            {!hasProfile && (
              <View style={Style.alertBox}>
                <Feather name="alert-circle" size={20} color="#E11D48" />
                <Text style={Style.alertText}>
                  Vui lòng tạo hồ sơ bệnh nhân trước khi đặt lịch khám. Hồ sơ
                  này giúp bác sĩ chẩn đoán chính xác hơn.
                </Text>
              </View>
            )}

            <View style={Style.formCard}>
              <View style={Style.cardHeader}>
                <MaterialCommunityIcons
                  name="card-account-details-outline"
                  size={20}
                  color="#4B5563"
                />
                <Text style={Style.cardTitle}>Thông tin cơ bản</Text>
              </View>

              <View style={Style.inputGroup}>
                <Text style={Style.inputLabel}>Địa chỉ liên hệ</Text>
                <TextInput
                  style={Style.input}
                  placeholder="Nhập địa chỉ của bạn"
                  placeholderTextColor="#9CA3AF"
                  value={formData.address}
                  onChangeText={(text) =>
                    setFormData({ ...formData, address: text })
                  }
                />
              </View>

              <View style={Style.rowInputs}>
                <View style={[Style.inputGroup, { flex: 1, marginRight: 12 }]}>
                  <Text style={Style.inputLabel}>
                    Ngày sinh <Text style={Style.required}>*</Text>
                  </Text>

                  <TouchableOpacity
                    style={Style.selectBox}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text
                      style={
                        formData.dob ? Style.selectText : Style.placeholderText
                      }
                    >
                      {formData.dob || "YYYY-MM-DD"}
                    </Text>
                    <Feather name="calendar" size={18} color="#9CA3AF" />
                  </TouchableOpacity>

                  {showDatePicker && (
                    <DateTimePicker
                      value={formData.dob ? new Date(formData.dob) : new Date()}
                      mode="date"
                      display="default"
                      maximumDate={new Date()}
                      onChange={handleDateChange}
                    />
                  )}
                </View>

                <View style={[Style.inputGroup, { flex: 1 }]}>
                  <Text style={Style.inputLabel}>
                    Giới tính <Text style={Style.required}>*</Text>
                  </Text>
                  <View style={Style.genderRow}>
                    {genders.map((g) => (
                      <TouchableOpacity
                        key={g.id}
                        style={[
                          Style.genderBtn,
                          formData.gender === g.id && Style.genderBtnActive,
                        ]}
                        onPress={() =>
                          setFormData({ ...formData, gender: g.id })
                        }
                      >
                        <Text
                          style={[
                            Style.genderText,
                            formData.gender === g.id && Style.genderTextActive,
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

            <View style={Style.formCard}>
              <View style={Style.cardHeader}>
                <MaterialCommunityIcons
                  name="human-male-height"
                  size={20}
                  color="#4B5563"
                />
                <Text style={Style.cardTitle}>Chỉ số cơ thể</Text>
              </View>
              <View style={Style.rowInputs}>
                <View style={[Style.inputGroup, { flex: 1, marginRight: 12 }]}>
                  <Text style={Style.inputLabel}>Chiều cao (cm)</Text>
                  <TextInput
                    style={Style.input}
                    placeholder="160"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={formData.height}
                    onChangeText={(text) =>
                      setFormData({ ...formData, height: text })
                    }
                  />
                </View>
                <View style={[Style.inputGroup, { flex: 1, marginRight: 12 }]}>
                  <Text style={Style.inputLabel}>Cân nặng (kg)</Text>
                  <TextInput
                    style={Style.input}
                    placeholder="50"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={formData.weight}
                    onChangeText={(text) =>
                      setFormData({ ...formData, weight: text })
                    }
                  />
                </View>
                <View style={[Style.inputGroup, { flex: 1 }]}>
                  <Text style={Style.inputLabel}>Nhóm máu</Text>

                  <TouchableOpacity
                    style={Style.selectBox}
                    onPress={() => setShowBloodTypeModal(true)}
                  >
                    <Text
                      style={
                        formData.blood_type
                          ? Style.selectText
                          : Style.placeholderText
                      }
                    >
                      {formData.blood_type || "Chọn"}
                    </Text>
                    <Feather name="chevron-down" size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={Style.formCard}>
              <View style={Style.cardHeader}>
                <MaterialCommunityIcons
                  name="medical-bag"
                  size={20}
                  color="#4B5563"
                />
                <Text style={Style.cardTitle}>Tiền sử y tế</Text>
              </View>
              <View style={Style.inputGroup}>
                <Text style={Style.inputLabel}>
                  Dị ứng (Thuốc, thức ăn,...)
                </Text>
                <TextInput
                  style={Style.textArea}
                  placeholder="Đậu phộng, hải sản, phấn hoa..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  value={formData.allergies}
                  onChangeText={(text) =>
                    setFormData({ ...formData, allergies: text })
                  }
                />
              </View>
              <View style={Style.inputGroup}>
                <Text style={Style.inputLabel}>
                  Bệnh lý mạn tính / Bệnh nền
                </Text>
                <TextInput
                  style={Style.textArea}
                  placeholder="Cao huyết áp, Tiểu đường..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  value={formData.chronic_diseases}
                  onChangeText={(text) =>
                    setFormData({ ...formData, chronic_diseases: text })
                  }
                />
              </View>
            </View>
            <View style={{ height: 100 }} />
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={Style.footer}>
          <TouchableOpacity
            style={Style.saveBtn}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={Style.saveBtnText}>
              {hasProfile ? "Cập nhật hồ sơ" : "Lưu hồ sơ"}
            </Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={showBloodTypeModal}
          transparent={true}
          animationType="fade"
        >
          <TouchableOpacity
            style={Style.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowBloodTypeModal(false)}
          >
            <View style={Style.dropdownContainer}>
              <Text style={Style.dropdownTitle}>Chọn nhóm máu</Text>
              {bloodTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={Style.dropdownItem}
                  onPress={() => {
                    setFormData({ ...formData, blood_type: type });
                    setShowBloodTypeModal(false);
                  }}
                >
                  <Text
                    style={[
                      Style.dropdownItemText,
                      formData.blood_type === type &&
                        Style.dropdownItemTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                  {formData.blood_type === type && (
                    <Feather name="check" size={20} color="#0066FF" />
                  )}
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={Style.cancelBtn}
                onPress={() => {
                  setFormData({ ...formData, blood_type: "" });
                  setShowBloodTypeModal(false);
                }}
              >
                <Text style={Style.cancelBtnText}>Bỏ chọn (Xóa)</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {loading && <LoadingModal visible={loading} />}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={Style.container}>
      <View style={Style.header}>
        <Text style={Style.headerTitle}>Tài khoản</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={Style.profileHeader}>
          <View style={Style.avatarContainer}>
            <Image
              source={{
                uri: user.avatar
                  ? user.avatar.includes("http")
                    ? user.avatar
                    : `https://res.cloudinary.com/dsc8rzpbg/${user.avatar}`
                  : `https://ui-avatars.com/api/?name=${user.first_name || "User"}&background=0066FF&color=fff`,
              }}
              style={Style.avatar}
            />
          </View>
          <Text style={Style.userName}>
            {user.first_name || user.last_name
              ? `${user.last_name || ""} ${user.first_name || ""}`.trim()
              : user.username || "Người dùng mới"}
          </Text>
          <Text style={Style.userEmail}>
            {user.phone
              ? `SĐT: ${user.phone}`
              : user.email
                ? `Email: ${user.email}`
                : "Chưa có số điện thoại"}
          </Text>
        </View>

        <View style={Style.mainContent}>
          {!hasProfile ? (
            <View style={Style.missingProfileCard}>
              <View style={Style.missingProfileHeader}>
                <View style={Style.warningIconBg}>
                  <Feather name="alert-triangle" size={24} color="#E11D48" />
                </View>
                <Text style={Style.missingProfileTitle}>
                  Chưa có hồ sơ y tế
                </Text>
              </View>
              <Text style={Style.missingProfileDesc}>
                Bạn cần tạo hồ sơ bệnh nhân trước khi sử dụng tính năng đặt lịch
                khám và nhận tư vấn từ bác sĩ.
              </Text>
              <TouchableOpacity
                style={Style.createProfileBtn}
                onPress={() => setIsEditing(true)}
              >
                <MaterialCommunityIcons
                  name="clipboard-plus-outline"
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={Style.createProfileBtnText}>
                  Tạo hồ sơ y tế ngay
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={Style.profileDataCard}>
              <View style={Style.profileDataHeader}>
                <Text style={Style.profileDataTitle}>Hồ sơ bệnh nhân</Text>
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  style={Style.editBtn}
                >
                  <Feather name="edit-2" size={16} color="#0066FF" />
                  <Text style={Style.editBtnText}>Sửa</Text>
                </TouchableOpacity>
              </View>

              <View style={Style.dataGrid}>
                <View style={Style.dataItem}>
                  <Text style={Style.dataLabel}>Ngày sinh</Text>
                  <Text style={Style.dataValue}>{formData.dob}</Text>
                </View>
                <View style={Style.dataItem}>
                  <Text style={Style.dataLabel}>Giới tính</Text>
                  <Text style={Style.dataValue}>
                    {formData.gender === "MALE"
                      ? "Nam"
                      : formData.gender === "FEMALE"
                        ? "Nữ"
                        : "Khác"}
                  </Text>
                </View>
                <View style={Style.dataItem}>
                  <Text style={Style.dataLabel}>Nhóm máu</Text>
                  <Text style={Style.dataValue}>
                    {formData.blood_type || "--"}
                  </Text>
                </View>
                <View style={Style.dataItem}>
                  <Text style={Style.dataLabel}>Thể trạng</Text>
                  <Text style={Style.dataValue}>
                    {formData.height}cm {formData.weight}kg
                  </Text>
                </View>
              </View>

              <View style={Style.dataRowFull}>
                <Text style={Style.dataLabel}>Địa chỉ</Text>
                <Text style={Style.dataValueFull}>
                  {formData.address || "Chưa cập nhật"}
                </Text>
              </View>
              <View style={Style.dataRowFull}>
                <Text style={Style.dataLabel}>Dị ứng</Text>
                <Text style={Style.dataValueFull}>
                  {formData.allergies || "Không có"}
                </Text>
              </View>
              <View style={Style.dataRowFull}>
                <Text style={Style.dataLabel}>Bệnh nền</Text>
                <Text style={Style.dataValueFull}>
                  {formData.chronic_diseases || "Không có"}
                </Text>
              </View>
            </View>
          )}

          <View style={Style.menuList}>
            <TouchableOpacity
              style={Style.menuItem}
              onPress={async () => {
                await unregisterDevice();
                await AsyncStorage.removeItem("user");
                dispatch({
                  type: "LOGOUT",
                });
              }}
            >
              <Feather name="log-out" size={22} color="#EF4444" />
              <Text style={[Style.menuItemText, { color: "#EF4444" }]}>
                Đăng xuất
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {loading && <LoadingModal visible={loading} />}
    </SafeAreaView>
  );
};

export default PatientProfileTab;
