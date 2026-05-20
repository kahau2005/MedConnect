import React, { useContext, useEffect, useRef, useState } from "react";
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
} from "react-native";

import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Style from "./Style";
import Apis, { authApis, endpoint } from "../../../../configs/Apis";
import { UserContext } from "../../../../contexts/UserContext";
import LoginPanel from "../../../../components/LoginPanel/LoginPanel";

// ── HELPERS ───────────────────────────────────────────────────
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

  const loadAppointment = async (isLoadMore = false) => {
    if (isLoadingRef.current || (!hasMore && isLoadMore) || !user?.access_token)
      return;
    isLoadingRef.current = true;
    if (!refreshing) setLoading(true);
    try {
      const statusParam = activeFilter === "ALL" ? "" : activeFilter;
      const res = await authApis(user.access_token).get(
        `${endpoint.appointment}?offset=${offset}&kw=${kw}&status=${statusParam}`,
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

  // ── MỞ MODAL CHI TIẾT — gọi API checkout để lấy data thực ──
  const openDetail = async (item) => {
    if (item.status !== "COMPLETED") return;
    setSelectedAppointment(item);
    setDetailData(null);
    setDetailModalVisible(true);
    setLoadingDetail(true);
    try {
      const res = await authApis(user.access_token).post(
        endpoint.checkout(item.id),
      );
      setDetailData(res.data);
    } catch (err) {
      console.error("Lỗi tải chi tiết:", err.status);

      Alert.alert("Lỗi", "Không thể tải chi tiết lịch khám.");
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setKw(searchTxt), 500);
    return () => clearTimeout(t);
  }, [searchTxt]);

  useEffect(() => {
    if (!user) return;
    setHasMore(true);
    if (offset === 0) loadAppointment(false);
    else setOffset(0);
  }, [user, kw, activeFilter]);

  useEffect(() => {
    if (!user) return;
    if (offset > 0) loadAppointment(true);
  }, [offset, user]);

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

    const services = detailData.items.filter((i) => i.type === "SERVICE");
    const medicines = detailData.items.filter((i) => i.type === "MEDICINE");
    const total = parseFloat(detailData.total_amount);
    const isPaid =
      detailData.status === "PAID" || detailData.status === "COMPLETED";

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={Style.modalScroll}
      >
        {/* DỊCH VỤ Y TẾ */}
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
            <View
              style={{
                marginLeft: "auto",
                backgroundColor: "#F3E8FF",
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 10,
              }}
            >
              <Text
                style={{ fontSize: 11, fontWeight: "600", color: "#9333EA" }}
              >
                {services.length} dịch vụ
              </Text>
            </View>
          </View>

          <View style={Style.itemList}>
            {services.map((svc, idx) => {
              const lineTotal = svc.unit_price * svc.quantity;
              return (
                <View key={idx} style={Style.itemRow}>
                  <View style={Style.itemLeft}>
                    <View style={Style.bulletPoint} />
                    <View style={{ flex: 1 }}>
                      <Text style={Style.itemName}>{svc.name}</Text>
                      <Text
                        style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}
                      >
                        SL: {svc.quantity} × {fmt(svc.unit_price)}
                      </Text>
                    </View>
                  </View>
                  <Text style={Style.itemPrice}>{fmt(lineTotal)}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ĐƠN THUỐC */}
        {medicines.length > 0 && (
          <View style={Style.sectionCard}>
            <View style={Style.sectionHeader}>
              <View style={[Style.iconBox, { backgroundColor: "#E8FBF4" }]}>
                <MaterialCommunityIcons name="pill" size={20} color="#00D084" />
              </View>
              <Text style={Style.sectionTitle}>Đơn thuốc</Text>
              <View
                style={{
                  marginLeft: "auto",
                  backgroundColor: "#E8FBF4",
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{ fontSize: 11, fontWeight: "600", color: "#059669" }}
                >
                  {medicines.length} mục
                </Text>
              </View>
            </View>

            <View style={Style.itemList}>
              {medicines.map((med, idx) => {
                const lineTotal = med.total ?? med.unit_price * med.quantity;
                return (
                  <View key={idx} style={Style.itemRow}>
                    <View style={Style.itemLeft}>
                      <View style={Style.bulletPoint} />
                      <View style={{ flex: 1 }}>
                        <Text style={Style.itemName}>
                          {med.name}{" "}
                          <Text style={Style.itemQty}>×{med.quantity}</Text>
                        </Text>
                        {med.instruction && (
                          <View style={Style.instructionBadge}>
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

        {/* TỔNG QUAN THANH TOÁN */}
        <View style={Style.receiptCard}>
          <Text style={Style.receiptTitle}>Tổng quan thanh toán</Text>
          <View style={Style.receiptDashedLine} />

          <View style={Style.receiptRow}>
            <Text style={Style.receiptLabel}>Dịch vụ y tế</Text>
            <Text
              style={[
                Style.receiptLabel,
                { color: "#111827", fontWeight: "600" },
              ]}
            >
              {fmt(services.reduce((a, i) => a + i.unit_price * i.quantity, 0))}
            </Text>
          </View>

          <View style={Style.receiptRow}>
            <Text style={Style.receiptLabel}>Thuốc</Text>
            <Text
              style={[
                Style.receiptLabel,
                { color: "#111827", fontWeight: "600" },
              ]}
            >
              {fmt(
                medicines.reduce(
                  (a, i) => a + (i.total ?? i.unit_price * i.quantity),
                  0,
                ),
              )}
            </Text>
          </View>

          <View style={Style.receiptRow}>
            <Text style={Style.receiptLabel}>Trạng thái</Text>
            <View style={Style.checkoutStatusBadge}>
              <MaterialCommunityIcons
                name={isPaid ? "check-circle" : "clock-outline"}
                size={14}
                color={isPaid ? "#059669" : "#D97706"}
              />
              <Text
                style={[
                  Style.checkoutStatusText,
                  !isPaid && { color: "#D97706" },
                ]}
              >
                {" "}
                {isPaid ? "Đã thanh toán" : "Chờ thanh toán"}
              </Text>
            </View>
          </View>

          <View style={Style.receiptRowTotal}>
            <Text style={Style.receiptTotalLabel}>Tổng cộng</Text>
            <Text style={Style.receiptTotalAmount}>{fmt(total)}</Text>
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

              <View style={Style.cardBottom}>
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
                    <TouchableOpacity style={Style.actionBtnReview}>
                      <Text style={Style.actionBtnReviewText}>Đánh giá</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {item.status === "CANCELLED" && (
                  <TouchableOpacity style={Style.actionBtnOutline}>
                    <Text style={Style.actionBtnOutlineText}>Đặt lại lịch</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* MODAL CHI TIẾT */}
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
