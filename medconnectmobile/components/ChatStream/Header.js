import React, { useLayoutEffect } from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { headerStyles as styles } from "./Style";

const Header = ({
  nav,
  appointmentId,
  isDevDoctor,
  onOpenMenu,
  onAudioCall,
  onVideoCall,
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
          {isDevDoctor && (
            <TouchableOpacity onPress={onOpenMenu} style={styles.iconButton}>
              <Ionicons name="medical-outline" size={22} color="#059669" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onAudioCall} style={styles.iconButton}>
            <Feather name="phone" size={22} color="#0066FF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onVideoCall} style={styles.iconButton}>
            <Feather name="video" size={24} color="#0066FF" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [nav, appointmentId, isDevDoctor]);

  return null;
};

export default Header;
