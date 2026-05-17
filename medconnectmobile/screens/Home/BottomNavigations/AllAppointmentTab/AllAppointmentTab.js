import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Platform,
} from "react-native";

import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Style from "./Style";
import Apis, { authApis, endpoint } from "../../../../configs/Apis";
import { UserContext } from "../../../../contexts/UserContext";

// Dữ liệu chi tiết tạm thời giữ nguyên để test Modal
const mockDetailData = {
  diagnosis: "Viêm loét dạ dày - Bất thường X-Quang Phổi",
  services: [
    { name: "Xét nghiệm máu tổng quát", price: 150000, result: "Bình thường" },
    { name: "Chụp X-Quang Phổi", price: 200000, result: "Bất thường" },
  ],
  prescriptions: [
    {
      name: "Amoxicillin 500mg",
      qty: 28,
      instruction: "AFTER_MEAL",
      total: 140000,
    },
    {
      name: "Paracetamol 500mg",
      qty: 7,
      instruction: "BEFORE_MEAL",
      total: 14000,
    },
  ],
  checkout: { total: 924000, status: "PAID" },
};

const AllAppointmentTab = () => {
  const nav = useNavigation();

  const [isDoctorMode, setIsDoctorMode] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchKw, setSearchKw] = useState("");
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // States chứa dữ liệu thực từ API
  const [appointment, setAppointment] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [user] = useContext(UserContext);

  const getStatusConfig = (status) => {
    switch (status) {
      case "SCHEDULED":
        return { label: "Sắp tới", bg: "#EBF4FF", text: "#0066FF" };
      case "COMPLETED":
        return { label: "Hoàn thành", bg: "#E8FBF4", text: "#00D084" };
      case "CANCELLED":
        return { label: "Đã hủy", bg: "#FEF2F2", text: "#EF4444" };
      case "PENDING":
        return { label: "Chờ xác nhận", bg: "#FFF7E6", text: "#FF9800" };
      default:
        return { label: status, bg: "#F3F4F6", text: "#374151" };
    }
  };

  // Helper tách thời gian ISO (2026-04-16T08:00:00Z) thành Ngày và Giờ
  const formatDateTime = (isoString) => {
    if (!isoString) return { date: "--/--/----", time: "--:--" };
    const d = new Date(isoString);

    // Format Date: DD/MM/YYYY
    const date = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;

    // Format Time: HH:MM AM/PM
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 giờ -> 12
    const time = `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;

    return { date, time };
  };

  // Nạp dữ liệu có truyền URL để hỗ trợ phân trang
  // const loadAppointment = async () => {
  //   try {
  //     setLoading(true);
  //     let result = await authApis.get(
  //       `${endpoint.appointment}?offset=${offset}`,
  //     );
  //     setDoctors([...doctors, ...result.data.results]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const loadAppointment = async (url = endpoint.appointment) => {
    if (!user || !user.access_token) return;
    try {
      const res = await authApis(user.access_token).get(url);

      // Sửa lại thành res.data.results theo chuẩn API JSON bạn cung cấp
      setAppointment(res.data.results);
      setNextPage(res.data.next);
      setPrevPage(res.data.previous);
    } catch (error) {
      console.error("Lỗi lấy danh sách lịch hẹn:", error);
    }
  };

  const openDetail = (item) => {
    if (item.status === "COMPLETED") {
      setSelectedAppointment(item);
      setDetailModalVisible(true);
    }
  };

  useEffect(() => {
    loadAppointment();
  }, [user]);

  return (
    <SafeAreaView style={Style.container}>
      <View style={Style.header}>
        <Text style={Style.headerTitle}>Lịch hẹn & Tư vấn</Text>
        <TouchableOpacity
          style={Style.doctorToggleBtn}
          onPress={() => setIsDoctorMode(!isDoctorMode)}
        >
          <Text style={Style.doctorToggleText}>
            {isDoctorMode ? "View: Bác sĩ" : "View: Bệnh nhân"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={Style.filterSection}>
        <View style={Style.searchBar}>
          <Feather name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={Style.searchInput}
            placeholder="Tìm kiếm theo tên, dịch vụ..."
            value={searchKw}
            onChangeText={setSearchKw}
          />
        </View>
        {!isDoctorMode && (
          <>
            <View style={Style.dateDoctorFilterRow}>
              <TouchableOpacity style={Style.dropdownBtn}>
                <Feather name="calendar" size={16} color="#4B5563" />
                <Text style={Style.dropdownText}>Chọn ngày</Text>
              </TouchableOpacity>

              <TouchableOpacity style={Style.dropdownBtn}>
                <MaterialCommunityIcons
                  name="stethoscope"
                  size={16}
                  color="#4B5563"
                />
                <Text style={Style.dropdownText}>Chọn Bác sĩ</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={Style.statusScroll}
            >
              {["ALL", "PENDING", "SCHEDULED", "COMPLETED", "CANCELLED"].map(
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={Style.scrollContent}
      >
        {appointment.map((item) => {
          const statusConfig = getStatusConfig(item.status);
          const { date, time } = formatDateTime(item.start);

          return (
            <TouchableOpacity
              key={item.id}
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
                    {/* Backend hiện chỉ trả về ID của bác sĩ */}
                    <Text style={Style.doctorName}>
                      Bác sĩ ID: {item.doctor}
                    </Text>
                    {/* Hiển thị lý do khám, nếu null thì in chữ mặc định */}
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

              <View style={Style.cardBottom}>
                {item.status === "SCHEDULED" && (
                  <TouchableOpacity
                    onPress={() => nav.navigate("ChatStream")}
                    style={Style.actionBtnPrimary}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons
                      name="video"
                      size={20}
                      color="#FFFFFF"
                    />
                    <Text style={Style.actionBtnPrimaryText}>Bắt đầu khám</Text>
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
                    <TouchableOpacity style={Style.actionBtnReview}>
                      <Text style={Style.actionBtnReviewText}>Đánh giá</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {(item.status === "CANCELLED" || item.status === "PENDING") && (
                  <TouchableOpacity style={Style.actionBtnOutline}>
                    <Text style={Style.actionBtnOutlineText}>Đặt lại lịch</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* --- XỬ LÝ PHÂN TRANG THỰC TẾ --- */}
        <View style={Style.pagination}>
          <TouchableOpacity
            style={[Style.pageBtn, !prevPage && { opacity: 0.3 }]}
            disabled={!prevPage}
            onPress={() => loadAppointment(prevPage)}
          >
            <Feather name="chevron-left" size={20} color="#4B5563" />
          </TouchableOpacity>

          <TouchableOpacity style={[Style.pageBtn, Style.pageBtnActive]}>
            <Feather name="more-horizontal" size={20} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[Style.pageBtn, !nextPage && { opacity: 0.3 }]}
            disabled={!nextPage}
            onPress={() => loadAppointment(nextPage)}
          >
            <Feather name="chevron-right" size={20} color="#4B5563" />
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal
        visible={detailModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={Style.modalOverlay}>
          <View style={Style.modalContent}>
            <View style={Style.modalHeader}>
              <View>
                <Text style={Style.modalTitle}>Chi tiết Hồ sơ</Text>
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

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={Style.modalScroll}
            >
              <View style={Style.sectionCard}>
                <View style={Style.sectionHeader}>
                  <View style={[Style.iconBox, { backgroundColor: "#EBF4FF" }]}>
                    <MaterialCommunityIcons
                      name="clipboard-pulse"
                      size={20}
                      color="#0066FF"
                    />
                  </View>
                  <Text style={Style.sectionTitle}>Chẩn đoán lâm sàng</Text>
                </View>
                <Text style={Style.diagnosisText}>
                  {mockDetailData.diagnosis}
                </Text>
              </View>

              <View style={Style.sectionCard}>
                <View style={Style.sectionHeader}>
                  <View style={[Style.iconBox, { backgroundColor: "#F3E8FF" }]}>
                    <MaterialCommunityIcons
                      name="flask-outline"
                      size={20}
                      color="#9333EA"
                    />
                  </View>
                  <Text style={Style.sectionTitle}>Các dịch vụ thêm</Text>
                </View>
                <View style={Style.itemList}>
                  {mockDetailData.services.map((svc, idx) => (
                    <View key={idx} style={Style.itemRow}>
                      <View style={Style.itemLeft}>
                        <View style={Style.bulletPoint} />
                        <View>
                          <Text style={Style.itemName}>{svc.name}</Text>
                          <Text style={Style.itemResult}>
                            Kết luận:{" "}
                            <Text style={Style.itemResultHighlight}>
                              {svc.result}
                            </Text>
                          </Text>
                        </View>
                      </View>
                      <Text style={Style.itemPrice}>
                        {svc.price.toLocaleString()}đ
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={Style.sectionCard}>
                <View style={Style.sectionHeader}>
                  <View style={[Style.iconBox, { backgroundColor: "#E8FBF4" }]}>
                    <MaterialCommunityIcons
                      name="pill"
                      size={20}
                      color="#00D084"
                    />
                  </View>
                  <Text style={Style.sectionTitle}>Đơn thuốc</Text>
                </View>
                <View style={Style.itemList}>
                  {mockDetailData.prescriptions.map((med, idx) => (
                    <View key={idx} style={Style.itemRow}>
                      <View style={Style.itemLeft}>
                        <View style={Style.bulletPoint} />
                        <View>
                          <Text style={Style.itemName}>
                            {med.name}{" "}
                            <Text style={Style.itemQty}>x{med.qty}</Text>
                          </Text>
                          <View style={Style.instructionBadge}>
                            <Text style={Style.instructionText}>
                              {med.instruction}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <Text style={Style.itemPrice}>
                        {med.total.toLocaleString()}đ
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={Style.receiptCard}>
                <Text style={Style.receiptTitle}>Tổng quan thanh toán</Text>
                <View style={Style.receiptDashedLine} />

                <View style={Style.receiptRow}>
                  <Text style={Style.receiptLabel}>Trạng thái</Text>
                  <View style={Style.checkoutStatusBadge}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={14}
                      color="#059669"
                    />
                    <Text style={Style.checkoutStatusText}> Đã thanh toán</Text>
                  </View>
                </View>

                <View style={Style.receiptRowTotal}>
                  <Text style={Style.receiptTotalLabel}>Tổng cộng</Text>
                  <Text style={Style.receiptTotalAmount}>
                    {mockDetailData.checkout.total.toLocaleString()} VNĐ
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AllAppointmentTab;
