import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import Apis, { endpoint } from "../../../configs/Apis";

const { width } = Dimensions.get("window");

const HomeTab = ({ navigation }) => {
  const [upcomingAppointment, setUpcomingAppointment] = useState(false);
  const [popularDoctor, setPopularDoctor] = useState([]);

  const handleButtonClick = (viewName) => {
    navigation.navigate(viewName);
  };

  const loadPopularDoctor = async () => {
    const res = await Apis.get(endpoint.popular_dotor);
    setPopularDoctor(res.data);
    console.log(res.data);
  };

  useEffect(() => {
    loadPopularDoctor();
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerWrapper}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.bannerImage}
            source={require("../../../assets/imgs/banner_app.webp")}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.mainBookCard}
            activeOpacity={0.8}
            onPress={() => handleButtonClick("Appointment")}
          >
            <View style={styles.mainBookContent}>
              <View style={styles.calendarIconBg}>
                <Feather name="calendar" size={22} color="#0066FF" />
              </View>
              <Text style={styles.mainBookText}>Đặt lịch khám</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#A0AAB5" />
          </TouchableOpacity>

          <View style={styles.subActionRow}>
            <TouchableOpacity
              style={styles.subActionCard}
              activeOpacity={0.7}
              onPress={() => handleButtonClick("Doctor")}
            >
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons
                  name="stethoscope"
                  size={26}
                  color="#0066FF"
                />
              </View>
              <Text style={styles.subActionText}>Bác sĩ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.subActionCard}
              activeOpacity={0.7}
              onPress={() => handleButtonClick("Specialty")}
            >
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons
                  name="hospital-building"
                  size={26}
                  color="#00D084"
                />
              </View>
              <Text style={styles.subActionText}>Chuyên khoa</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.subActionCard}
              activeOpacity={0.7}
              onPress={() => handleButtonClick("Service")}
            >
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons
                  name="medical-bag"
                  size={26}
                  color="#FF9800"
                />
              </View>
              <Text style={styles.subActionText}>Dịch vụ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.contentPadding}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Lịch khám sắp tới</Text>
        </View>
        {upcomingAppointment ? (
          <View style={styles.upcomingCard}>
            <View style={styles.dateBox}>
              <Text style={styles.dateDay}>15</Text>
              <Text style={styles.dateMonth}>Thg 5</Text>
            </View>
            <View style={styles.upcomingInfo}>
              <Text style={styles.upcomingDoctor}>BS. Phillip Franci</Text>
              <Text style={styles.upcomingSpec}>Chuyên khoa Tim mạch</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>10:00 AM</Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.emptyUpcomingCard}
            activeOpacity={0.85}
            onPress={() => handleButtonClick("Appointment")}
          >
            <View style={styles.emptyCardContent}>
              <View style={styles.emptyIconBg}>
                <MaterialCommunityIcons
                  name="calendar-heart"
                  size={28}
                  color="#0066FF"
                />
              </View>
              <View style={styles.emptyTextContainer}>
                <Text style={styles.emptyCardTitle}>
                  Bạn chưa có lịch khám nào
                </Text>
                <Text style={styles.emptyCardSub}>
                  Hãy chủ động bảo vệ sức khỏe. Đặt lịch hẹn với bác sĩ chuyên
                  khoa ngay hôm nay.
                </Text>
              </View>
            </View>
            <View style={styles.emptyCardAction}>
              <Text style={styles.emptyActionText}>Đặt lịch ngay</Text>
              <Feather name="arrow-right" size={14} color="#0066FF" />
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Bác sĩ nổi bật</Text>
          <TouchableOpacity onPress={() => handleButtonClick("Doctor")}>
            <Text style={styles.seeAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.doctorsScrollContent}
      >
        {popularDoctor.map((doc) => (
          <TouchableOpacity
            key={doc.id}
            style={styles.doctorCard}
            activeOpacity={0.8}
            onPress={() => handleButtonClick("DoctorDetail")}
          >
            <Image source={{ uri: doc.avatar }} style={styles.doctorImage} />
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName} numberOfLines={1}>
                {`${doc.first_name} ${doc.last_name}`}
              </Text>
              <Text style={styles.doctorSpec} numberOfLines={1}>
                {doc.background}
              </Text>

              <View style={styles.ratingRow}>
                <MaterialCommunityIcons name="star" size={16} color="#FFB800" />
                <Text style={styles.ratingText}>{doc.avg_rating}</Text>
                <Text style={styles.reviewText}>({doc.reviews} đánh giá)</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={{ paddingBottom: 40 }}></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F9",
  },
  headerWrapper: {
    marginBottom: 10,
  },
  imageContainer: {
    width: width,
    height: 240,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  actionContainer: {
    paddingHorizontal: 16,
    marginTop: -50,
  },
  mainBookCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  mainBookContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  calendarIconBg: {
    backgroundColor: "#F0F5FF",
    padding: 10,
    borderRadius: 12,
    marginRight: 12,
  },
  mainBookText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  subActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  subActionCard: {
    backgroundColor: "#FFFFFF",
    width: "31%",
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#F4F6F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  subActionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
  },
  contentPadding: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  seeAllText: {
    fontSize: 14,
    color: "#0066FF",
    fontWeight: "600",
  },
  upcomingCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  dateBox: {
    backgroundColor: "#F0F5FF",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    marginRight: 12,
  },
  dateDay: { fontSize: 18, fontWeight: "bold", color: "#0066FF" },
  dateMonth: { fontSize: 12, color: "#0066FF", fontWeight: "500" },
  upcomingInfo: { flex: 1 },
  upcomingDoctor: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  upcomingSpec: { fontSize: 13, color: "#6B7280" },
  statusBadge: {
    backgroundColor: "#E8FBF4",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: { color: "#00D084", fontSize: 12, fontWeight: "bold" },

  // STYLE CARD INVITATION KHI TRỐNG
  emptyUpcomingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#EBF0F5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  emptyCardContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  emptyIconBg: {
    backgroundColor: "#F0F5FF",
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  emptyTextContainer: {
    flex: 1,
  },
  emptyCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  emptyCardSub: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  emptyCardAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
    gap: 4,
  },
  emptyActionText: {
    color: "#0066FF",
    fontSize: 14,
    fontWeight: "700",
  },

  doctorsScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  doctorCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    width: 170,
    marginRight: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 12,
  },
  doctorImage: {
    width: "100%",
    height: 130,
    resizeMode: "cover",
    backgroundColor: "#F0F5FF",
  },
  doctorInfo: {
    padding: 12,
  },
  doctorName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  doctorSpec: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    marginLeft: 4,
  },
  reviewText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginLeft: 4,
  },
});

export default HomeTab;
