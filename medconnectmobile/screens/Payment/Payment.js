import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  NativeModules,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import Style from "./Style";
import { authApis, endpoint } from "../../configs/Apis";
import { UserContext } from "../../contexts/UserContext";
import { useRoute } from "@react-navigation/native";

const { ZaloPayModule } = NativeModules;

const fmt = (n) => Math.round(n).toLocaleString("vi-VN") + "đ";

const formatDate = (isoString) => {
  const d = new Date(isoString);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

const ItemRow = ({ item, isService }) => {
  const lineTotal = isService
    ? item.unit_price * item.quantity
    : (item.total ?? item.unit_price * item.quantity);

  return (
    <View style={Style.itemRow}>
      <View
        style={[Style.itemIcon, isService ? Style.iconBlue : Style.iconGreen]}
      >
        {isService ? (
          <MaterialCommunityIcons
            name="stethoscope"
            size={16}
            color="#1D4ED8"
          />
        ) : (
          <MaterialCommunityIcons name="pill" size={16} color="#15803D" />
        )}
      </View>
      <View style={Style.itemInfo}>
        <Text style={Style.itemName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={Style.itemQty}>
          SL: {item.quantity} × {fmt(item.unit_price)}
        </Text>
      </View>
      <Text style={Style.itemPrice}>{fmt(lineTotal)}</Text>
    </View>
  );
};

const SectionCard = ({ title, icon, badge, badgeStyle, items, isService }) => (
  <View style={Style.section}>
    <View style={Style.sectionHead}>
      <View style={Style.sectionTitleRow}>
        {icon}
        <Text style={Style.sectionTitle}>{title}</Text>
      </View>
      <View style={[Style.badge, badgeStyle]}>
        <Text
          style={[
            Style.badgeText,
            isService ? Style.badgeTextBlue : Style.badgeTextGreen,
          ]}
        >
          {badge}
        </Text>
      </View>
    </View>
    {items.map((item, idx) => (
      <ItemRow key={idx} item={item} isService={isService} />
    ))}
  </View>
);

const Payment = () => {
  const route = useRoute();
  const appointmentId = route.params?.appointmentId;
  const [user] = useContext(UserContext);

  const [paymentData, setPaymentData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingPay, setLoadingPay] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("PENDING");

  const loadPaymentData = async () => {
    try {
      setLoadingData(true);
      const res = await authApis(user.access_token).post(
        endpoint.checkout(appointmentId),
      );
      setPaymentData(res.data);
    } catch (error) {
      const errData = error?.response?.data?.err;
      const errorMessage = Array.isArray(errData)
        ? errData[0]
        : errData || "Không xác định!";
      Alert.alert("Lỗi", errorMessage);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user) loadPaymentData();
  }, [appointmentId]);

  const handlePay = async () => {
    setLoadingPay(true);
    try {
      const res = await authApis(user.access_token).post(
        endpoint.zalopay(paymentData.id),
      );
      const zpTransToken = res.data.zp_trans_token;

      if (!zpTransToken) {
        Alert.alert("Lỗi", "Không lấy được token thanh toán từ máy chủ.");
        return;
      }

      const result = await ZaloPayModule.payOrder(zpTransToken);

      if (result === "SUCCESS") {
        Alert.alert("Thành công", "Thanh toán ZaloPay thành công!");
        setPaymentStatus("COMPLETED");
      }
    } catch (error) {
      if (error.code === "CANCELED") {
        Alert.alert("Thông báo", "Bạn đã huỷ quá trình thanh toán.");
      } else {
        const errData = error?.response?.data?.err;
        const errorMessage = Array.isArray(errData)
          ? errData[0]
          : errData || "Không xác định!";
        Alert.alert("Lỗi", errorMessage);
      }
    } finally {
      setLoadingPay(false);
    }
  };

  if (loadingData) {
    return (
      <SafeAreaView
        style={[
          Style.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#0068FF" />
        <Text style={{ marginTop: 12, color: "#6B7280", fontSize: 14 }}>
          Đang tải thông tin thanh toán...
        </Text>
      </SafeAreaView>
    );
  }

  if (!paymentData) return null;

  const services = paymentData.items.filter((i) => i.type === "SERVICE");
  const medicines = paymentData.items.filter((i) => i.type === "MEDICINE");
  const sumService = services.reduce(
    (a, i) => a + i.unit_price * i.quantity,
    0,
  );
  const sumMedicine = medicines.reduce(
    (a, i) => a + (i.total ?? i.unit_price * i.quantity),
    0,
  );
  const total = parseFloat(paymentData.total_amount);

  return (
    <SafeAreaView style={Style.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={Style.hero}>
          <View
            style={[
              Style.statusCircle,
              paymentStatus === "COMPLETED" && { backgroundColor: "#D1FAE5" },
            ]}
          >
            <Feather
              name={paymentStatus === "COMPLETED" ? "check-circle" : "clock"}
              size={28}
              color={paymentStatus === "COMPLETED" ? "#059669" : "#D97706"}
            />
          </View>

          <Text style={Style.heroLabel}>Tổng thanh toán</Text>
          <Text style={Style.heroAmount}>{fmt(total)}</Text>

          <View
            style={[
              Style.statusPill,
              paymentStatus === "COMPLETED" && { backgroundColor: "#D1FAE5" },
            ]}
          >
            <Feather
              name={paymentStatus === "COMPLETED" ? "check" : "clock"}
              size={12}
              color={paymentStatus === "COMPLETED" ? "#065F46" : "#92400E"}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                Style.statusText,
                paymentStatus === "COMPLETED" && { color: "#065F46" },
              ]}
            >
              {paymentStatus === "COMPLETED"
                ? "Thanh toán thành công"
                : "Chờ thanh toán"}
            </Text>
          </View>

          <View style={Style.metaRow}>
            <View style={Style.metaCard}>
              <Text style={Style.metaLabel}>Mã giao dịch</Text>
              <Text style={Style.metaValue}>#{paymentData.id}</Text>
            </View>
            <View style={Style.metaCard}>
              <Text style={Style.metaLabel}>Ngày tạo</Text>
              <Text style={Style.metaValue}>
                {formatDate(paymentData.created_at)}
              </Text>
            </View>
          </View>
        </View>

        <SectionCard
          title="Dịch vụ y tế"
          icon={
            <MaterialCommunityIcons
              name="stethoscope"
              size={16}
              color="#1D4ED8"
              style={{ marginRight: 6 }}
            />
          }
          badge={`${services.length} dịch vụ`}
          badgeStyle={Style.badgeBlue}
          items={services}
          isService={true}
        />
        <SectionCard
          title="Đơn thuốc"
          icon={
            <MaterialCommunityIcons
              name="pill"
              size={16}
              color="#15803D"
              style={{ marginRight: 6 }}
            />
          }
          badge={`${medicines.length} mục`}
          badgeStyle={Style.badgeGreen}
          items={medicines}
          isService={false}
        />

        <View style={Style.summarySection}>
          <View style={Style.sumRow}>
            <Text style={Style.sumLabel}>Dịch vụ y tế</Text>
            <Text style={Style.sumVal}>{fmt(sumService)}</Text>
          </View>
          <View style={Style.sumRow}>
            <Text style={Style.sumLabel}>Thuốc</Text>
            <Text style={Style.sumVal}>{fmt(sumMedicine)}</Text>
          </View>
          <View style={Style.divider} />
          <View style={Style.sumRow}>
            <Text style={Style.sumTotalLabel}>Tổng cộng</Text>
            <Text style={Style.sumTotalVal}>{fmt(total)}</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {paymentStatus !== "COMPLETED" && (
        <View style={Style.bottomContainer}>
          <TouchableOpacity
            style={[Style.zaloPayButton, loadingPay && { opacity: 0.7 }]}
            onPress={handlePay}
            disabled={loadingPay}
            activeOpacity={0.85}
          >
            <View style={Style.zaloLeft}>
              <View style={Style.zaloLogo}>
                {loadingPay ? (
                  <ActivityIndicator size="small" color="#0068FF" />
                ) : (
                  <Text style={Style.zaloLogoText}>Z</Text>
                )}
              </View>
              <Text style={Style.zaloText}>
                {loadingPay ? "Đang xử lý..." : "Thanh toán với ZaloPay"}
              </Text>
            </View>
            <Text style={Style.zaloAmount}>{fmt(total)}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Payment;
