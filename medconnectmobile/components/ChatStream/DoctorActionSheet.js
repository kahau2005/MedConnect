import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { modalStyles as styles } from "./Style";

const DoctorActionSheet = ({ visible, onClose, onSelectModal }) => {
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

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              onClose();
              onSelectModal("PRESCRIPTION_LIST");
            }}
          >
            <View
              style={[styles.actionIconBox, { backgroundColor: "#EBF4FF" }]}
            >
              <MaterialCommunityIcons
                name="clipboard-pulse"
                size={24}
                color="#0066FF"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionItemText}>Quản lý Đơn thuốc</Text>
              <Text style={styles.actionItemSubText}>Tạo đơn & Thêm thuốc</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              onClose();
              onSelectModal("SERVICE");
            }}
          >
            <View
              style={[styles.actionIconBox, { backgroundColor: "#FFF7E6" }]}
            >
              <MaterialCommunityIcons name="needle" size={24} color="#FF9800" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionItemText}>
                Thêm dịch vụ cho cuộc hẹn
              </Text>
              <Text style={styles.actionItemSubText}>Thêm dịch vụ khám</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              onClose();
              onSelectModal("DIAGNOSIS");
            }}
          >
            <View
              style={[styles.actionIconBox, { backgroundColor: "#E6FFFA" }]}
            >
              <MaterialCommunityIcons
                name="stethoscope"
                size={24}
                color="#0D9488"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionItemText}>Chuẩn đoán</Text>
              <Text style={styles.actionItemSubText}>
                Cập nhật kết quả khám bệnh
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              onClose();
              onSelectModal("RESULT");
            }}
          >
            <View
              style={[styles.actionIconBox, { backgroundColor: "#F3E8FF" }]}
            >
              <MaterialCommunityIcons
                name="file-document-edit-outline"
                size={24}
                color="#9333EA"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionItemText}>Xét Nghiệm</Text>
              <Text style={styles.actionItemSubText}>
                Thêm kết quả xét nghiệm
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default DoctorActionSheet;
