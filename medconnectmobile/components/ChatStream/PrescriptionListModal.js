import React from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { modalStyles, medicineStyles } from "./Style";

const PrescriptionListModal = ({
  visible,
  prescriptions,
  onClose,
  onSelectPrescription,
  onOpenAddForm,
}) => {
  const formatCreatedDate = (isoString) => {
    if (!isoString) return "Không rõ ngày tạo";
    const d = new Date(isoString);
    const date = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `Ngày tạo: ${date}/${month}/${year}`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={modalStyles.modalOverlay}>
        <View
          style={[
            modalStyles.formModal,
            { flex: 0.85, paddingHorizontal: 0, paddingBottom: 0 },
          ]}
        >
          <View style={[modalStyles.formHeader, { paddingHorizontal: 20 }]}>
            <Text style={modalStyles.formTitle}>Danh sách đơn thuốc</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 100,
            }}
          >
            {prescriptions.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={medicineStyles.prescriptionCard}
                onPress={() => onSelectPrescription(item)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={medicineStyles.preCardTitle} numberOfLines={1}>
                    {item.diagnosis
                      ? item.diagnosis
                      : `Đơn thuốc số #${item.id}`}
                  </Text>

                  <Text style={medicineStyles.preCardSubText} numberOfLines={2}>
                    {item.note ? item.note : formatCreatedDate(item.created_at)}
                  </Text>

                  <View style={medicineStyles.preCardBadge}>
                    <MaterialCommunityIcons
                      name="pill"
                      size={12}
                      color="#059669"
                    />
                    <Text style={medicineStyles.preCardBadgeText}>
                      {item.details?.length || 0} loại thuốc
                    </Text>
                  </View>
                </View>
                <View style={medicineStyles.preCardBtn}>
                  <Feather name="plus" size={20} color="#0066FF" />
                  <Text style={medicineStyles.preCardBtnText}>Thêm thuốc</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={modalStyles.bottomFixedArea}>
            <TouchableOpacity
              style={modalStyles.submitBtn}
              onPress={onOpenAddForm}
            >
              <Feather
                name="plus-circle"
                size={18}
                color="#FFFFFF"
                style={{ marginRight: 8 }}
              />
              <Text style={modalStyles.submitBtnText}>Tạo đơn thuốc mới</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PrescriptionListModal;
