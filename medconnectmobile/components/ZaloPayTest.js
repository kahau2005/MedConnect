import { useState } from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
  NativeModules,
} from "react-native";
import API, { endpoint } from "../configs/Apis";

const { ZaloPayModule } = NativeModules;

const ZaloPayTestButton = () => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await API.get(endpoint.test);

      const zpTransToken = response.data.order_token;

      if (zpTransToken) {
        const result = await ZaloPayModule.payOrder(zpTransToken);

        if (result === "SUCCESS") {
          Alert.alert("Thành công", "Thanh toán ZaloPay thành công!");
        }
      } else {
        Alert.alert("Lỗi API", "Không lấy được order_token từ server");
      }
    } catch (error) {
      if (error.code === "CANCELED") {
        Alert.alert("Thông báo", "Bạn đã hủy quá trình thanh toán.");
      } else {
        console.log("Lỗi thanh toán:", error);
        Alert.alert(
          "Lỗi",
          error.message || "Không thể gọi tới backend hoặc ZaloPay bị lỗi.",
        );
      }
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
        <Text style={styles.buttonText}>Test ZaloPay Sandbox (App-to-App)</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#0068FF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ZaloPayTestButton;
