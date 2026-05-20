import React, { useLayoutEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { headerStyles as styles } from "./Style";

const Header = ({
  nav,
  appointmentId,
  isDevDoctor,
  onOpenMenu,
  onAudioCall,
  onVideoCall,
  onPayment,
}) => {
  useLayoutEffect(() => {
    nav.setOptions({
      headerShown: true,
      headerShadowVisible: true,
      headerStyle: { backgroundColor: "#FFFFFF" },
      headerTitleAlign: "start",
      headerTitle: () => (
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Lịch khám #{appointmentId}</Text>
          <Text style={styles.headerSubtitle}>Trực tuyến</Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => nav.goBack()}
          style={{ padding: 8, marginLeft: 8 }}
        >
          <Feather name="chevron-left" size={28} color="#111827" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={styles.headerRight}>
          {isDevDoctor ? (
            /* Giao diện Bác sĩ */
            <>
              <TouchableOpacity onPress={onOpenMenu} style={styles.iconButton}>
                <MaterialCommunityIcons
                  name="medical-bag"
                  size={22}
                  color="#059669"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={onAudioCall} style={styles.iconButton}>
                <Feather name="phone" size={22} color="#0066FF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={onVideoCall} style={styles.iconButton}>
                <Feather name="video" size={24} color="#0066FF" />
              </TouchableOpacity>
            </>
          ) : (
            /* Giao diện Bệnh nhân (Đã bỏ nút rời đi) */
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                onPress={onPayment}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#E8FBF4",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                  marginRight: 10,
                  borderWidth: 1,
                  borderColor: "#10B981",
                }}
              >
                <MaterialCommunityIcons
                  name="credit-card-outline"
                  size={16}
                  color="#059669"
                />
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: "#059669",
                    marginLeft: 4,
                  }}
                >
                  Thanh toán
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={onAudioCall} style={styles.iconButton}>
                <Feather name="phone" size={22} color="#0066FF" />
              </TouchableOpacity>

              <TouchableOpacity onPress={onVideoCall} style={styles.iconButton}>
                <Feather name="video" size={24} color="#0066FF" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      ),
    });
  }, [nav, appointmentId, isDevDoctor, onPayment]);

  return null;
};

export default Header;
