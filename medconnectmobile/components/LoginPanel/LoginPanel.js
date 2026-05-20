import React from "react";
import { View, Text, TouchableOpacity, Styleheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Style from "./Style";

const LoginPanel = ({
  headerTitle = "MedConnect",
  title = "Chào mừng bạn đến với MedConnect",
  subtitle = "Vui lòng đăng nhập hoặc tạo tài khoản để quản lý hồ sơ y tế và đặt lịch khám cùng bác sĩ.",
}) => {
  const nav = useNavigation();

  return (
    <SafeAreaView style={Style.container}>
      <View style={Style.header}>
        <Text style={Style.headerTitle}>{headerTitle}</Text>
      </View>
      <View style={Style.guestContainer}>
        <View style={Style.guestIconBg}>
          <Feather name="shield" size={48} color="#0066FF" />
        </View>
        <Text style={Style.guestTitle}>{title}</Text>
        <Text style={Style.guestSub}>{subtitle}</Text>

        <TouchableOpacity
          style={Style.primaryBtn}
          activeOpacity={0.8}
          onPress={() => nav.navigate("Login")}
        >
          <Text style={Style.primaryBtnText}>Đăng nhập</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={Style.outlineBtn}
          activeOpacity={0.8}
          onPress={() => nav.navigate("Register")}
        >
          <Text style={Style.outlineBtnText}>Đăng ký tài khoản</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginPanel;
