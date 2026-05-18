import { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";

import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Style from "./Style";
import Apis, { authApis, endpoint } from "../../../../configs/Apis";
import { UserContext } from "../../../../contexts/UserContext";

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

  // State quản lý văn bản nhập realtime trên TextInput (Tránh lag UI)
  const [searchTxt, setSearchTxt] = useState("");
  // State từ khóa thực tế sau khi đã qua bộ lọc Debounce để gửi lên API
  const [kw, setKw] = useState("");

  const [offset, setOffset] = useState(0);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [appointment, setAppointment] = useState([]);
  const [user] = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const isLoadingRef = useRef(false);

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

  const formatDateTime = (isoString) => {
    if (!isoString) return { date: "--/--/----", time: "--:--" };
    const d = new Date(isoString);

    const date = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const time = `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;

    return { date, time };
  };

  const loadAppointment = async (isLoadMore = false) => {
    // Chặn ngay lập tức nếu đang có request API khác đang chạy
    if (
      isLoadingRef.current ||
      (!hasMore && isLoadMore) ||
      !user ||
      !user.access_token
    )
      return;

    isLoadingRef.current = true; // Khóa request
    setLoading(true); // Cập nhật UI

    try {
      const statusParam = activeFilter === "ALL" ? "" : activeFilter;

      const res = await authApis(user.access_token).get(
        `${endpoint.appointment}?offset=${offset}&kw=${kw}&status=${statusParam}`,
      );

      const newData = res.data.results || [];

      if (isLoadMore) {
        setAppointment((prev) => {
          // MÀNG LỌC AN TOÀN: Loại bỏ những phần tử bị trùng ID trước khi gộp
          const existingIds = new Set(prev.map((item) => item.id));
          const filteredNewData = newData.filter(
            (item) => !existingIds.has(item.id),
          );
          return [...prev, ...filteredNewData];
        });
      } else {
        setAppointment(newData);
      }

      if (!res.data.next || newData.length === 0) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error("Lỗi load appointment:", error);
    } finally {
      isLoadingRef.current = false; // Mở khóa request
      setLoading(false);
    }
  };
  const handleGoToChat = async (appointmentId) => {
    try {
      const response = await authApis(user.access_token).post(
        endpoint.chat_room(appointmentId),
      );

      if (response.status === 201 || response.status === 200) {
        nav.navigate("ChatStream", { appointmentId: appointmentId });
      }
    } catch (error) {
      console.error("Lỗi khi khởi tạo phòng chat:", error);
      // Hiển thị cụ thể lỗi trả về từ Server để nhận biết nhanh
      const errorMsg = error.response
        ? `Status: ${error.response.status}`
        : error.message;
      Alert.alert("Lỗi phòng chat", `Không thể kết nối: ${errorMsg}`);
    }
  };

  // ==========================================
  // 1. KỸ THUẬT DEBOUNCE TÌM KIẾM (500ms)
  // ==========================================
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setKw(searchTxt);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTxt]);

  // ==========================================
  // 2. XỬ LÝ KHI TỪ KHÓA TÌM KIẾM HOẶC TRẠNG THÁI THAY ĐỔI
  // ==========================================
  useEffect(() => {
    if (!user) return;

    setHasMore(true);

    if (offset === 0) {
      // Nếu đang ở trang 0 sẵn, chủ động tải lại list
      loadAppointment(false);
    } else {
      // Đưa về 0 (Hành động này sẽ kích hoạt useEffect bên dưới chạy)
      setOffset(0);
    }
  }, [user, kw, activeFilter]);

  // ==========================================
  // 3. QUẢN LÝ TIẾN TRÌNH PHÂN TRANG (OFFSET THAY ĐỔI)
  // ==========================================
  useEffect(() => {
    if (!user) return;

    // Chỉ load thêm dữ liệu khi offset lớn hơn 0
    if (offset > 0) {
      loadAppointment(true);
    }
  }, [offset, user]);

  const openDetail = (item) => {
    if (item.status === "COMPLETED") {
      setSelectedAppointment(item);
      setDetailModalVisible(true);
    }
  };

  // ==========================================
  // VIEW KHI NGƯỜI DÙNG CHƯA ĐĂNG NHẬP
  // ==========================================
  if (!user) {
    return (
      <SafeAreaView style={[Style.container, { backgroundColor: "#F9FAFB" }]}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
          }}
        >
          {/* Decorative Background Elements */}
          <View
            style={{
              position: "absolute",
              top: "10%",
              left: -40,
              width: 160,
              height: 160,
              borderRadius: 80,
              backgroundColor: "rgba(0, 102, 255, 0.04)",
            }}
          />
          <View
            style={{
              position: "absolute",
              bottom: "15%",
              right: -50,
              width: 220,
              height: 220,
              borderRadius: 110,
              backgroundColor: "rgba(0, 208, 132, 0.04)",
            }}
          />

          {/* Icon Header with Layered Glow */}
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 35,
            }}
          >
            <View
              style={{
                width: 140,
                height: 140,
                borderRadius: 70,
                backgroundColor: "rgba(0, 102, 255, 0.08)",
                position: "absolute",
              }}
            />
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: "rgba(0, 102, 255, 0.15)",
                position: "absolute",
              }}
            />
            <View
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: "#0066FF",
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#0066FF",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 8,
              }}
            >
              <MaterialCommunityIcons
                name="calendar-lock"
                size={32}
                color="#FFFFFF"
              />
            </View>
          </View>

          {/* Typography Content */}
          <Text
            style={{
              fontSize: 24,
              fontWeight: "800",
              color: "#111827",
              marginBottom: 12,
              textAlign: "center",
              letterSpacing: 0.3,
            }}
          >
            Quản lý sức khỏe thông minh
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#6B7280",
              textAlign: "center",
              marginBottom: 40,
              lineHeight: 24,
            }}
          >
            Đăng nhập để đặt lịch khám, kết nối với bác sĩ chuyên khoa và theo
            dõi hồ sơ y tế của bạn mọi lúc, mọi nơi.
          </Text>

          {/* Action Buttons */}
          <View style={{ width: "100%", gap: 16 }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#0066FF",
                width: "100%",
                paddingVertical: 16,
                borderRadius: 14,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
                shadowColor: "#0066FF",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                elevation: 6,
              }}
              onPress={() => nav.navigate("Login")}
              activeOpacity={0.8}
            >
              <Feather name="log-in" size={20} color="#FFFFFF" />
              <Text
                style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "700" }}
              >
                Đăng nhập ngay
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: "100%",
                paddingVertical: 16,
                borderRadius: 14,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                borderWidth: 1,
                borderColor: "#E5E7EB",
              }}
              // Điều hướng tới màn hình đăng ký của bạn, đổi "Register" thành tên màn hình thực tế nếu khác
              onPress={() => nav.navigate("Register")}
              activeOpacity={0.7}
            >
              <Text
                style={{ color: "#374151", fontSize: 16, fontWeight: "600" }}
              >
                Chưa có tài khoản? Đăng ký
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================
  // VIEW CHÍNH KHI ĐÃ ĐĂNG NHẬP
  // ==========================================
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
            value={searchTxt}
            onChangeText={setSearchTxt}
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

      <FlatList
        data={appointment}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
        contentContainerStyle={Style.scrollContent}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (!loading && hasMore) {
            setOffset((prev) => prev + 8);
          }
        }}
        onEndReachedThreshold={0.3}
        ListFooterComponent={() =>
          loading ? (
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

              <View style={Style.cardBottom}>
                {item.status === "SCHEDULED" && (
                  <TouchableOpacity
                    onPress={() => handleGoToChat(item.id)}
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
        }}
      />

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
