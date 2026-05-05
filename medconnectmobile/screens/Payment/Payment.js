import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import Style from "./Style";

const Payment = () => {
  return (
    <SafeAreaView style={Style.container}>
      <View style={Style.content}>
        <View style={Style.header}>
          <View style={Style.iconBackground}>
            <Feather name="clock" size={40} color="#F59E0B" />
            {/* <MaterialCommunityIcons
              name="shield-check"
              size={40}
              color="#00D084"
            /> */}
          </View>
          <Text style={Style.title}>Xác nhận thanh toán</Text>
          <Text style={Style.subtitle}>
            Vui lòng kiểm tra chi tiết 150.000đ
          </Text>
        </View>

        <Text style={Style.sectionTitle}>Chi tiết giao dịch</Text>

        <View style={Style.card}>
          <View style={Style.row}>
            <Text style={Style.label}>Mã giao dịch</Text>
            <Text style={Style.value}>4352 2748 3920</Text>
          </View>

          <View style={Style.row}>
            <Text style={Style.label}>Ngày</Text>
            <Text style={Style.value}>05 Tháng 5, 2026</Text>
          </View>

          <View style={Style.row}>
            <Text style={Style.label}>Dịch vụ</Text>
            <Text style={Style.value}>Khám chuyên khoa</Text>
          </View>

          <View style={Style.row}>
            <Text style={Style.label}>Tạm tính</Text>
            <Text style={Style.value}>150.000đ</Text>
          </View>

          <View style={Style.row}>
            <Text style={Style.label}>Phí xử lý</Text>
            <Text style={Style.value}>5.000đ</Text>
          </View>

          <View style={[Style.row, Style.lastRow]}>
            <Text style={Style.label}>Trạng thái</Text>
            <View style={Style.statusBadge}>
              <Feather
                name="clock"
                size={14}
                color="#F59E0B"
                style={Style.statusIcon}
              />
              <Text style={Style.statusText}>Chờ thanh toán</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={Style.bottomContainer}>
        <TouchableOpacity style={Style.zaloPayButton}>
          <Text style={Style.buttonText}>Thanh toán với ZaloPay</Text>
          <Text style={Style.buttonAmount}>155.000đ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Payment;
