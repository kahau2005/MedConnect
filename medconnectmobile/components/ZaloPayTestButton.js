import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
  Linking,
  StyleSheet,
} from "react-native";
import API, { endpoint } from "../configs/Apis";

const ZaloPayTestButton = () => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Gọi xuống backend Django (địa chỉ 192.168.100.26:8000)
      const response = await API.get(endpoint.test);

      const orderUrl = response.data.order_url;

      if (orderUrl) {
        // 2. Kiểm tra xem điện thoại có thể mở được link này không
        const supported = await Linking.canOpenURL(orderUrl);

        if (supported) {
          // 3. Hệ điều hành sẽ tự bung app ZaloPay Sandbox lên
          await Linking.openURL(orderUrl);
        } else {
          Alert.alert(
            "Lỗi",
            "Không thể mở được ZaloPay. Bạn đã cài app Sandbox chưa?",
          );
        }
      } else {
        Alert.alert("Lỗi API", "Không lấy được order_url từ server");
      }
    } catch (error) {
      console.log("Lỗi thanh toán:", error);
      Alert.alert(
        "Lỗi kết nối",
        "Không thể gọi tới backend Django. Hãy check lại IP/Port.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePayment}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>Test ZaloPay Sandbox</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#0068ff", // Màu xanh đặc trưng của ZaloPay
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    elevation: 3, // Tạo bóng nhẹ trên Android
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ZaloPayTestButton;
