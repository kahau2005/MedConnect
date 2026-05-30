import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";

import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";

import Style from "./Style";
import Apis, { authApis, endpoint } from "../../../../configs/Apis";
import { UserContext } from "../../../../contexts/UserContext";
import LoginPanel from "../../../../components/LoginPanel/LoginPanel";

const fmt = (n) => Math.round(n).toLocaleString("vi-VN") + "đ";

const getInstructionLabel = (val) => {
  switch (val) {
    case "AFTER_MEAL":
      return "Sau ăn";
    case "BEFORE_MEAL":
      return "Trước ăn";
    case "WHEN_PAIN":
      return "Khi đau";
    default:
      return val || "";
  }
};

const AllAppointmentTab = () => {
  const nav = useNavigation();

  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchTxt, setSearchTxt] = useState("");
  const [kw, setKw] = useState("");
  const [offset, setOffset] = useState(0);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [doctorModalVisible, setDoctorModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorsList, setDoctorsList] = useState([]);

  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [appointment, setAppointment] = useState([]);
  const [user] = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isLoadingRef = useRef(false);
  const isDoctorMode = user?.role === "DOCTOR" || false;

  const getStatusConfig = (status) => {
    switch (status) {
      case "SCHEDULED":
        return { label: "Sắp tới", bg: "#EBF4FF", text: "#0066FF" };
      case "PENDING":
        return { label: "Đang khám", bg: "#FFF7E6", text: "#FF9800" };
      case "COMPLETED":
        return { label: "Hoàn thành", bg: "#E8FBF4", text: "#00D084" };
      case "CANCELLED":
      case "CANCELED":
        return { label: "Đã hủy", bg: "#FEF2F2", text: "#EF4444" };
      default:
        return { label: status, bg: "#F3F4F6", text: "#374151" };
    }
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return { date: "--/--/----", time: "--:--" };
    const d = new Date(isoString);
    const date = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const time = `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
    return { date, time };
  };

  const displaySelectedDate = (dateStr) => {
    if (!dateStr) return "Chọn ngày";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const onDateChange = (event, selected) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (event.type === "set" && selected) {
      const year = selected.getFullYear();
      const month = String(selected.getMonth() + 1).padStart(2, "0");
      const day = String(selected.getDate()).padStart(2, "0");
      setSelectedDate(`${year}-${month}-${day}`);
    } else if (event.type === "dismissed") {
      setShowDatePicker(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await authApis(user.access_token).patch(
        endpoint.update_appointment(appointmentId),
        {
          status: "CANCELED",
        },
      );
      Alert.alert("Thành công!", "Hủy lịch khám thành công!");
      handleRefresh();
    } catch (err) {
      Alert.alert("Lỗi hủy lịch!", err.message);
    }
  };

  const loadDoctorsList = async () => {
    if (!user?.access_token || isDoctorMode) return;
    try {
      const res = await authApis(user.access_token).get(
        `${endpoint.appointment}/doctors/`,
      );
      setDoctorsList(res.data);
    } catch (error) {
      console.log("Lỗi tải danh sách bác sĩ:", error);
    }
  };

  useEffect(() => {
    loadDoctorsList();
  }, [user]);

  const loadAppointment = async (isLoadMore = false) => {
    if (isLoadingRef.current || (!hasMore && isLoadMore) || !user?.access_token)
      return;
    isLoadingRef.current = true;
    if (!refreshing) setLoading(true);
    try {
      const statusParam = activeFilter === "ALL" ? "" : activeFilter;
      const dateParam = selectedDate ? `&from_date=${selectedDate}` : "";
      const doctorParam = selectedDoctor
        ? `&doctor_id=${selectedDoctor.id}`
        : "";

      const res = await authApis(user.access_token).get(
        `${endpoint.appointment}?offset=${offset}&kw=${kw}&status=${statusParam}${dateParam}${doctorParam}`,
      );
      const newData = res.data.results || [];
      if (isLoadMore) {
        setAppointment((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          return [
            ...prev,
            ...newData.filter((item) => !existingIds.has(item.id)),
          ];
        });
      } else {
        setAppointment(newData);
      }
      setHasMore(!(!res.data.next || newData.length === 0));
    } catch (error) {
      console.error("Lỗi load appointment:", error);
    } finally {
      isLoadingRef.current = false;
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setOffset(0);
    setHasMore(true);
    await loadAppointment(false);
    setRefreshing(false);
  };

  useEffect(() => {
    if (!user) return;
    setHasMore(true);
    if (offset === 0) loadAppointment(false);
    else setOffset(0);
  }, [user, kw, activeFilter, selectedDate, selectedDoctor]);

  useEffect(() => {
    if (!user) return;
    if (offset > 0) loadAppointment(true);
  }, [offset, user]);

  const handleGoToChat = async (appointmentId, status) => {
    try {
      const response = await authApis(user.access_token).post(
        endpoint.chat_room(appointmentId),
      );
      if (response.status === 201 || response.status === 200) {
        nav.navigate("ChatStream", { appointmentId, status });
      }
    } catch (error) {
      const errorMsg = error.response
        ? `Status: ${error.response.status}`
        : error.message;
      Alert.alert("Lỗi phòng chat", `Không thể kết nối: ${errorMsg}`);
    }
  };

  const openDetail = async (item) => {
    if (item.status !== "COMPLETED") return;
    setSelectedAppointment(item);
    setDetailData(null);
    setDetailModalVisible(true);
    setLoadingDetail(true);
    try {
      const res = await authApis(user.access_token).get(
        endpoint.appointmentDetails(item.id),
      );
      setDetailData(res.data);
    } catch (err) {
      console.error("Lỗi tải chi tiết: ", err.status);
      Alert.alert("Lỗi", "Không thể tải chi tiết lịch khám.");
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setKw(searchTxt), 500);
    return () => clearTimeout(t);
  }, [searchTxt]);

  if (!user) {
    return (
      <LoginPanel
        headerTitle="Tài khoản"
        title="Chào mừng bạn đến với MedConnect"
        subtitle="Vui lòng đăng nhập hoặc tạo tài khoản để quản lý hồ sơ y tế và đặt lịch khám cùng bác sĩ."
      />
    );
  }

  const renderDetailContent = () => {
    if (loadingDetail) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 60,
          }}
        >
          <ActivityIndicator size="large" color="#0066FF" />
          <Text style={{ marginTop: 12, color: "#6B7280", fontSize: 14 }}>
            Đang tải chi tiết...
          </Text>
        </View>
      );
    }

    if (!detailData) return null;

    // Mapping new data structure
    const services = detailData.services || [];
    const medicines = (detailData.prescriptions || []).flatMap(
      (p) => p.details || [],
    );

    const totalService = services.reduce(
      (acc, curr) => acc + curr.quantity * parseFloat(curr.unit_price),
      0,
    );
    const totalMed = medicines.reduce(
      (acc, curr) => acc + curr.quantity * parseFloat(curr.unit_price),
      0,
    );
    const totalAmount = totalService + totalMed;

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={Style.modalScroll}
      >
        {(detailData.diagnosis || detailData.symptoms || detailData.reason) && (
          <View style={Style.sectionCard}>
            <View style={Style.sectionHeader}>
              <View style={[Style.iconBox, { backgroundColor: "#FCE7F3" }]}>
                <MaterialCommunityIcons
                  name="clipboard-pulse-outline"
                  size={20}
                  color="#DB2777"
                />
              </View>
              <Text style={Style.sectionTitle}>Thông tin khám</Text>
            </View>
            <View style={{ padding: 16 }}>
              {detailData.reason ? (
                <Text
                  style={{ fontSize: 14, color: "#374151", marginBottom: 6 }}
                >
                  <Text style={{ fontWeight: "700" }}>Lý do khám: </Text>
                  {detailData.reason}
                </Text>
              ) : null}
              {detailData.symptoms ? (
                <Text
                  style={{ fontSize: 14, color: "#374151", marginBottom: 6 }}
                >
                  <Text style={{ fontWeight: "700" }}>Triệu chứng: </Text>
                  {detailData.symptoms}
                </Text>
              ) : null}
              {detailData.diagnosis ? (
                <Text style={{ fontSize: 14, color: "#374151" }}>
                  <Text style={{ fontWeight: "700" }}>Chẩn đoán: </Text>
                  {detailData.diagnosis.name}
                </Text>
              ) : null}
            </View>
          </View>
        )}

        {services.length > 0 && (
          <View style={Style.sectionCard}>
            <View style={Style.sectionHeader}>
              <View style={[Style.iconBox, { backgroundColor: "#F3E8FF" }]}>
                <MaterialCommunityIcons
                  name="flask-outline"
                  size={20}
                  color="#9333EA"
                />
              </View>
              <Text style={Style.sectionTitle}>Dịch vụ y tế</Text>
            </View>
            <View style={Style.itemList}>
              {services.map((svc, idx) => {
                const lineTotal = svc.quantity * parseFloat(svc.unit_price);
                return (
                  <View key={`svc-${idx}`} style={Style.itemRow}>
                    <View style={Style.itemLeft}>
                      <View style={Style.bulletPoint} />
                      <View style={{ flex: 1 }}>
                        <Text style={Style.itemName}>{svc.service?.name}</Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#9CA3AF",
                            marginTop: 2,
                          }}
                        >
                          SL: {svc.quantity} × {fmt(parseFloat(svc.unit_price))}
                        </Text>
                      </View>
                    </View>
                    <Text style={Style.itemPrice}>{fmt(lineTotal)}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {medicines.length > 0 && (
          <View style={Style.sectionCard}>
            <View style={Style.sectionHeader}>
              <View style={[Style.iconBox, { backgroundColor: "#E8FBF4" }]}>
                <MaterialCommunityIcons name="pill" size={20} color="#00D084" />
              </View>
              <Text style={Style.sectionTitle}>Đơn thuốc</Text>
            </View>
            <View style={Style.itemList}>
              {medicines.map((med, idx) => {
                const lineTotal = med.quantity * parseFloat(med.unit_price);
                return (
                  <View key={`med-${idx}`} style={Style.itemRow}>
                    <View style={Style.itemLeft}>
                      <View style={Style.bulletPoint} />
                      <View style={{ flex: 1 }}>
                        <Text style={Style.itemName}>
                          {med.medicine?.name}{" "}
                          <Text style={Style.itemQty}>×{med.quantity}</Text>
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#9CA3AF",
                            marginTop: 2,
                          }}
                        >
                          {med.dose} liều/lần, {med.frequency} lần/ngày (trong{" "}
                          {med.duration_day} ngày)
                        </Text>
                        {med.instruction && (
                          <View
                            style={[Style.instructionBadge, { marginTop: 6 }]}
                          >
                            <Text style={Style.instructionText}>
                              {getInstructionLabel(med.instruction)}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <Text style={Style.itemPrice}>{fmt(lineTotal)}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <View style={Style.receiptCard}>
          <Text style={Style.receiptTitle}>Tổng quan thanh toán</Text>
          <View style={Style.receiptRowTotal}>
            <Text style={Style.receiptTotalLabel}>Tổng cộng</Text>
            <Text style={Style.receiptTotalAmount}>{fmt(totalAmount)}</Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={Style.container}>
      <View style={Style.header}>
        <Text style={Style.headerTitle}>Lịch hẹn & Tư vấn</Text>
      </View>

      <View style={Style.filterSection}>
        <View style={Style.searchBar}>
          <Feather name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={Style.searchInput}
            placeholder="Tìm kiếm theo tên, dịch vụ..."
            value={searchTxt}
            onChangeText={setSearchTxt}
          />
        </View>
        {!isDoctorMode && (
          <>
            <View style={Style.dateDoctorFilterRow}>
              <View
                style={[
                  Style.dropdownBtn,
                  selectedDate && {
                    backgroundColor: "#EBF4FF",
                    borderColor: "#0066FF",
                    paddingRight: 8,
                    paddingLeft: 8,
                  },
                ]}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                  }}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Feather
                    name="calendar"
                    size={16}
                    color={selectedDate ? "#0066FF" : "#4B5563"}
                  />
                  <Text
                    style={[
                      Style.dropdownText,
                      selectedDate && { color: "#0066FF", fontWeight: "600" },
                    ]}
                  >
                    {selectedDate
                      ? displaySelectedDate(selectedDate)
                      : "Chọn ngày"}
                  </Text>
                </TouchableOpacity>
                {selectedDate && (
                  <TouchableOpacity
                    onPress={() => setSelectedDate(null)}
                    style={{ padding: 4 }}
                  >
                    <Feather name="x-circle" size={16} color="#0066FF" />
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                style={[
                  Style.dropdownBtn,
                  selectedDoctor && {
                    backgroundColor: "#EBF4FF",
                    borderColor: "#0066FF",
                  },
                ]}
                onPress={() => setDoctorModalVisible(true)}
              >
                <MaterialCommunityIcons
                  name="stethoscope"
                  size={16}
                  color={selectedDoctor ? "#0066FF" : "#4B5563"}
                />
                <Text
                  style={[
                    Style.dropdownText,
                    selectedDoctor && { color: "#0066FF", fontWeight: "600" },
                  ]}
                  numberOfLines={1}
                >
                  {selectedDoctor
                    ? `${selectedDoctor.first_name || ""} ${selectedDoctor.last_name || ""}`.trim()
                    : "Chọn Bác sĩ"}
                </Text>

                {selectedDoctor && (
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      setSelectedDoctor(null);
                    }}
                    style={{ marginLeft: 4 }}
                  >
                    <Feather name="x-circle" size={16} color="#0066FF" />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={Style.statusScroll}
            >
              {["ALL", "PENDING", "SCHEDULED", "COMPLETED", "CANCELED"].map(
                (status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      Style.statusChip,
                      activeFilter === status && Style.statusChipActive,
                    ]}
                    onPress={() => setActiveFilter(status)}
                  >
                    <Text
                      style={[
                        Style.statusChipText,
                        activeFilter === status && Style.statusChipTextActive,
                      ]}
                    >
                      {status === "ALL"
                        ? "Tất cả"
                        : getStatusConfig(status).label}
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </ScrollView>
          </>
        )}
      </View>

      <FlatList
        data={appointment}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
        contentContainerStyle={Style.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={() => {
          if (!loading && hasMore) setOffset((prev) => prev + 8);
        }}
        onEndReachedThreshold={0.3}
        ListFooterComponent={() =>
          loading && !refreshing ? (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator size="small" color="#0066FF" />
            </View>
          ) : (
            <View style={{ height: 40 }} />
          )
        }
        renderItem={({ item }) => {
          const statusConfig = getStatusConfig(item.status);
          const { date, time } = formatDateTime(item.start);

          return (
            <TouchableOpacity
              style={Style.appointmentCard}
              activeOpacity={item.status === "COMPLETED" ? 0.7 : 1}
              onPress={() => openDetail(item)}
            >
              <View style={Style.cardTop}>
                <View style={Style.doctorInfoRow}>
                  <View style={Style.avatarPlaceholder}>
                    <Feather name="user" size={20} color="#9CA3AF" />
                  </View>
                  <View style={Style.doctorInfo}>
                    <Text style={Style.doctorName}>
                      {item.doctor_info
                        ? `${item.doctor_info.first_name} ${item.doctor_info.last_name}`
                        : `Bác sĩ ID: ${item.doctor}`}
                    </Text>
                    <Text style={Style.doctorSpec}>
                      {item.reason || "Không rõ lý do khám"}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    Style.statusBadge,
                    { backgroundColor: statusConfig.bg },
                  ]}
                >
                  <Text
                    style={[Style.statusText, { color: statusConfig.text }]}
                  >
                    {statusConfig.label}
                  </Text>
                </View>
              </View>

              <View style={Style.cardMiddle}>
                <View style={Style.dateTimeBox}>
                  <Feather name="calendar" size={16} color="#6B7280" />
                  <Text style={Style.dateTimeText}>{date}</Text>
                </View>
                <View style={Style.dateTimeBox}>
                  <Feather name="clock" size={16} color="#6B7280" />
                  <Text style={Style.dateTimeText}>{time}</Text>
                </View>
              </View>

              <View style={[Style.cardBottom, { gap: 10 }]}>
                {(item.status === "SCHEDULED" || item.status === "PENDING") && (
                  <TouchableOpacity
                    onPress={() => handleGoToChat(item.id, item.status)}
                    style={[
                      Style.actionBtnPrimary,
                      item.status === "PENDING" && {
                        backgroundColor: "#FF9800",
                      },
                    ]}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons
                      name={
                        item.status === "PENDING" ? "chat-processing" : "video"
                      }
                      size={20}
                      color="#FFFFFF"
                    />
                    <Text style={Style.actionBtnPrimaryText}>
                      {item.status === "PENDING"
                        ? "Vào phòng khám"
                        : "Bắt đầu khám"}
                    </Text>
                  </TouchableOpacity>
                )}
                {item.status === "COMPLETED" && (
                  <View style={Style.completedActions}>
                    <TouchableOpacity
                      style={Style.actionBtnOutline}
                      onPress={() => openDetail(item)}
                    >
                      <Text style={Style.actionBtnOutlineText}>
                        Xem chi tiết
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                {item.status === "SCHEDULED" && !isDoctorMode && (
                  <View style={Style.completedActions}>
                    <TouchableOpacity
                      style={[
                        Style.actionBtnOutline,
                        { backgroundColor: "#e83232", borderColor: "#e83232" },
                      ]}
                      onPress={() => handleCancelAppointment(item.id)}
                    >
                      <Text
                        style={[Style.actionBtnOutlineText, { color: "white" }]}
                      >
                        Hủy lịch khám
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate ? new Date(selectedDate) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
        />
      )}

      <Modal
        visible={doctorModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setDoctorModalVisible(false)}
          />

          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingHorizontal: 20,
              paddingTop: 12,
              paddingBottom: Platform.OS === "ios" ? 32 : 20,
              maxHeight: "80%",
            }}
          >
            <View
              style={{
                alignSelf: "center",
                width: 48,
                height: 5,
                backgroundColor: "#E5E7EB",
                borderRadius: 3,
                marginBottom: 16,
              }}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <View>
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", color: "#111827" }}
                >
                  Chọn Bác sĩ
                </Text>
                <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>
                  Lọc lịch hẹn theo bác sĩ phụ trách
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setDoctorModalVisible(false)}
                style={{
                  backgroundColor: "#F3F4F6",
                  padding: 8,
                  borderRadius: 20,
                }}
              >
                <Feather name="x" size={20} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={[
                { id: null, first_name: "Tất cả", last_name: "Bác sĩ" },
                ...doctorsList,
              ]}
              keyExtractor={(item) => (item.id ? item.id.toString() : "all")}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = selectedDoctor?.id === item.id;
                const isAllOption = item.id === null;
                const name = isAllOption
                  ? "Tất cả bác sĩ"
                  : `Bs. ${item.first_name} ${item.last_name}`;

                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 16,
                      marginBottom: 12,
                      borderRadius: 16,
                      borderWidth: 1.5,
                      borderColor: isSelected ? "#0066FF" : "#F3F4F6",
                      backgroundColor: isSelected ? "#F5F9FF" : "#FFFFFF",
                    }}
                    onPress={() => {
                      setSelectedDoctor(isAllOption ? null : item);
                      setDoctorModalVisible(false);
                    }}
                  >
                    <View
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        backgroundColor: isAllOption ? "#E8FBF4" : "#EBF4FF",
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 16,
                      }}
                    >
                      {isAllOption ? (
                        <MaterialCommunityIcons
                          name="account-group"
                          size={24}
                          color="#00D084"
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name="stethoscope"
                          size={24}
                          color="#0066FF"
                        />
                      )}
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: isSelected ? "700" : "600",
                          color: isSelected ? "#0066FF" : "#1F2937",
                          marginBottom: 4,
                        }}
                      >
                        {name}
                      </Text>
                      <Text style={{ fontSize: 13, color: "#6B7280" }}>
                        {isAllOption
                          ? "Hiển thị lịch hẹn của mọi bác sĩ"
                          : item.specialty || "Chuyên khoa chung"}
                      </Text>
                    </View>

                    {isSelected && (
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          backgroundColor: "#0066FF",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Feather name="check" size={14} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={detailModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={Style.modalOverlay}>
          <View style={Style.modalContent}>
            <View style={Style.modalHeader}>
              <View>
                <Text style={Style.modalTitle}>Chi tiết hồ sơ</Text>
                <Text style={Style.modalSubTitle}>
                  Mã lịch khám: #{selectedAppointment?.id}
                </Text>
              </View>
              <TouchableOpacity
                style={Style.closeBtn}
                onPress={() => setDetailModalVisible(false)}
              >
                <Feather name="x" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>
            {renderDetailContent()}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AllAppointmentTab;
