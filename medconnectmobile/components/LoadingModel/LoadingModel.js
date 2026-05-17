import React from "react";
import { Modal, View, Text, ActivityIndicator, Styleheet } from "react-native";
import Style from "./Style";

const LoadingModal = ({ visible, message = "Đang xử lý..." }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      statusBarTranslucent={true}
    >
      <View style={Style.overlay}>
        <View style={Style.contentBox}>
          <ActivityIndicator size="large" color="#0066FF" />
          {message ? <Text style={Style.messageText}>{message}</Text> : null}
        </View>
      </View>
    </Modal>
  );
};

export default LoadingModal;
