import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { modalStyles as styles } from "./Style";

const DoctorActionSheet = ({ visible, onClose, onSelectModal }) => {
  const menus = [
    {
      id: "PRESCRIPTION_LIST",
      bg: "#EBF4FF",
      icon: "clipboard-pulse",
      color: "#0066FF",
      label: "Quản lý Đơn thuốc",
      desc: "Tạo đơn & Thêm thuốc",
    },
    {
      id: "SERVICE",
      bg: "#FFF7E6",
      icon: "needle",
      color: "#FF9800",
      label: "Thêm dịch vụ cho cuộc hẹn",
      desc: "Thêm dịch vụ khám",
    },
    {
      id: "DIAGNOSIS",
      bg: "#E6FFFA",
      icon: "stethoscope",
      color: "#0D9488",
      label: "Chuẩn đoán",
      desc: "Cập nhật kết quả khám bệnh",
    },
    {
      id: "RESULT",
      bg: "#F3E8FF",
      icon: "file-document-edit-outline",
      color: "#9333EA",
      label: "Xét Nghiệm",
      desc: "Thêm kết quả xét nghiệm",
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.actionSheet}>
          <View style={styles.dragIndicator} />
          <Text style={styles.actionSheetTitle}>Menu Bác Sĩ</Text>
          {menus.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.actionItem}
              onPress={() => {
                onClose();
                onSelectModal(item.id);
              }}
            >
              <View
                style={[styles.actionIconBox, { backgroundColor: item.bg }]}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={24}
                  color={item.color}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.actionItemText}>{item.label}</Text>
                <Text style={styles.actionItemSubText}>{item.desc}</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default DoctorActionSheet;
