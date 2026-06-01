import React, { useState, useEffect, useContext, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { modalStyles, medicineStyles as styles } from "./Style";
import { UserContext } from "../../contexts/UserContext";
import { authApis, endpoint } from "../../configs/Apis";

const MedicineSearchModal = ({
  visible,
  selectedPrescription,
  setSelectedPrescription,
  onClose,
  onBack,
  onOpenInputForm,
}) => {
  const [user] = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchKw, setSearchKw] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");

  useEffect(() => {
    if (visible && user) {
      fetchCategories();
    }
  }, [visible]);

  useEffect(() => {
    if (visible && user) {
      const delayDebounceFn = setTimeout(() => {
        fetchMedicines(activeCategory, searchKw);
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [visible, activeCategory, searchKw]);

  const fetchCategories = async () => {
    try {
      const resCats = await authApis(user.access_token).get(
        endpoint.medicine_categories,
      );
      setCategories([{ id: "ALL", name: "Tất cả" }, ...(resCats.data || [])]);
    } catch (error) {}
  };

  const fetchMedicines = async (categoryId, kw = "") => {
    try {
      setLoading(true);
      let url = endpoint.medicines + "?";
      if (categoryId !== "ALL") {
        url += `category_id=${categoryId}&`;
      }
      if (kw.trim() !== "") {
        url += `search=${encodeURIComponent(kw.trim())}&`;
      }
      const resMeds = await authApis(user.access_token).get(url);
      setMedicines(resMeds.data || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMedicine = (detailId) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa thuốc này khỏi đơn không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              console.log(detailId);
              await authApis(user.access_token).delete(
                endpoint.delete_medicine(detailId),
              );

              const res = await authApis(user.access_token).get(
                endpoint.medicines_in_prescription(selectedPrescription.id),
              );
              setSelectedPrescription(res.data);
            } catch (error) {
              Alert.alert("Lỗi", "Không thể xóa thuốc khỏi đơn.");
              console.log(error);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const getInstructionLabel = (enumValue) => {
    switch (enumValue) {
      case "AFTER_MEAL":
        return "Sau ăn";
      case "BEFORE_MEAL":
        return "Trước ăn";
      default:
        return enumValue || "Chưa có cách dùng";
    }
  };

  const addedMedicines = selectedPrescription?.details || [];

  const renderHeader = () => (
    console.log(addedMedicines),
    (
      <View style={{ paddingHorizontal: 20 }}>
        {addedMedicines.length > 0 && (
          <View style={styles.addedMedContainer}>
            <Text style={styles.addedMedTitle}>
              Đã thêm ({addedMedicines.length})
            </Text>
            {addedMedicines.map((m, idx) => (
              <View key={idx} style={styles.addedMedItem}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={styles.addedMedName}>
                    {m.medicine?.name || "Thuốc không rõ tên"}
                  </Text>
                  <Text style={styles.addedMedNote}>
                    {getInstructionLabel(m.instruction)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 4,
                    paddingLeft: 8,
                  }}
                  onPress={() => handleDeleteMedicine(m.id)}
                >
                  <MaterialIcons
                    name="delete-outline"
                    size={20}
                    color="#d62424ff"
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm tên thuốc, thành phần..."
            placeholderTextColor="#9CA3AF"
            value={searchKw}
            onChangeText={setSearchKw}
          />
          {searchKw !== "" && (
            <TouchableOpacity onPress={() => setSearchKw("")}>
              <Feather name="x-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginVertical: 16 }}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                activeCategory === cat.id && styles.categoryChipActive,
              ]}
              onPress={() => setActiveCategory(cat.id)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  activeCategory === cat.id && styles.categoryChipTextActive,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    )
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={modalStyles.modalOverlay}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View
          style={[
            modalStyles.formModal,
            { flex: 0.9, paddingHorizontal: 0, paddingBottom: 0 },
          ]}
        >
          <View
            style={[
              modalStyles.formHeader,
              { paddingHorizontal: 20, marginBottom: 12 },
            ]}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
            >
              <TouchableOpacity onPress={onBack} style={{ marginRight: 12 }}>
                <Feather name="arrow-left" size={24} color="#111827" />
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={modalStyles.formTitle}>Thêm thuốc vào đơn</Text>
              </View>
            </View>
          </View>

          <FlatList
            data={loading ? [] : medicines}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={renderHeader()}
            contentContainerStyle={{ paddingBottom: 40 }}
            ListEmptyComponent={() => (
              <View style={{ alignItems: "center", marginTop: 40 }}>
                {loading ? (
                  <>
                    <ActivityIndicator size="large" color="#0066FF" />
                    <Text style={{ marginTop: 12, color: "#6B7280" }}>
                      Đang tải danh mục thuốc...
                    </Text>
                  </>
                ) : (
                  <>
                    <MaterialCommunityIcons
                      name="pill"
                      size={48}
                      color="#D1D5DB"
                    />
                    <Text style={{ color: "#6B7280", marginTop: 12 }}>
                      Không tìm thấy loại thuốc nào.
                    </Text>
                  </>
                )}
              </View>
            )}
            renderItem={({ item }) => {
              const addedMed = addedMedicines.find(
                (m) => Number(m.medicine?.id) === Number(item.id),
              );
              return (
                <View style={styles.medCard}>
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <Text style={styles.medName}>{item.name}</Text>
                    <Text style={styles.medUnit}>
                      Kho: {item.stock} | Giá:{" "}
                      {parseInt(item.unit_price || 0).toLocaleString("vi-VN")}đ
                    </Text>
                  </View>
                  {addedMed ? (
                    <TouchableOpacity
                      style={[
                        styles.addMedBtn,
                        { backgroundColor: "#FEE2E2", borderColor: "#FEE2E2" },
                      ]}
                      onPress={() => handleDeleteMedicine(addedMed.id)}
                    >
                      <Text
                        style={[styles.addMedBtnText, { color: "#DC2626" }]}
                      >
                        Xóa
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.addMedBtn}
                      onPress={() => onOpenInputForm(item)}
                    >
                      <Text style={styles.addMedBtnText}>Chọn</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default MedicineSearchModal;
