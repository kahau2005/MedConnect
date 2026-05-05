import React from "react";
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
import HorizontalItemsView from "../../../components/HorizontalItemsView/HorizontalItemsView";

const { width } = Dimensions.get("window");

const doctors = [
  {
    id: 1,
    title: "Dr. John Doe",
    description: "Cardiologist",
    image: require("../../../assets/imgs/banner_doctor.png"),
    rating: 4.5,
  },
  {
    id: 2,
    title: "Dr. Jane Smith",
    description: "Dermatologist",
    image: require("../../../assets/imgs/banner_doctor.png"),
    rating: 4.7,
  },
  {
    id: 3,
    title: "Dr. Emily Johnson",
    description: "Pediatrician",
    image: require("../../../assets/imgs/banner_doctor.png"),
    rating: 4.8,
  },
];

const HomeTab = ({ navigation }) => {
  const handleButtonClick = (viewName) => {
    navigation.navigate(viewName);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER SECTION */}
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

        <TouchableOpacity
          style={styles.aiBanner}
          activeOpacity={0.9}
          onPress={() => handleButtonClick("AdvisoryTab")}
        >
          <View style={styles.aiBannerContent}>
            <Text style={styles.aiBannerTitle}>Không rõ mình bệnh gì?</Text>
            <Text style={styles.aiBannerSub}>
              Nhập triệu chứng, MedBot sẽ chẩn đoán và tìm đúng bác sĩ cho bạn.
            </Text>
            <View style={styles.aiBtn}>
              <Text style={styles.aiBtnText}>Hỏi AI ngay</Text>
              <Feather name="arrow-right" size={16} color="#FFF" />
            </View>
          </View>
          <Image
            source={require("../../../assets/imgs/banner_doctor.png")}
            style={styles.aiImage}
          />
        </TouchableOpacity>
      </View>

      <HorizontalItemsView title={"Bác sĩ nổi bật"} items={doctors} />

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

  aiBanner: {
    backgroundColor: "#6B4EFF",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    overflow: "hidden",
  },
  aiBannerContent: { flex: 1, paddingRight: 10 },
  aiBannerTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  aiBannerSub: {
    color: "#E0D8FF",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  aiBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  aiBtnText: { color: "#FFF", fontSize: 13, fontWeight: "600" },
  aiImage: { width: 80, height: 80, resizeMode: "contain", opacity: 0.9 },
});

export default HomeTab;
