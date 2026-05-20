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
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { modalStyles, medicineStyles as styles } from "./Style";
import { UserContext } from "../../contexts/UserContext";
import { authApis, endpoint } from "../../configs/Apis";

const MedicineSearchModal = ({
  visible,
  selectedPrescription,
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
      fetchMedicineData();
    }
  }, [visible]);

  const fetchMedicineData = async () => {
    try {
      setLoading(true);
      const [resMeds, resCats] = await Promise.all([
        authApis(user.access_token).get(endpoint.medicines),
        authApis(user.access_token).get(endpoint.medicine_categories),
      ]);
      setMedicines(resMeds.data || []);
      setCategories([{ id: "ALL", name: "Tất cả" }, ...(resCats.data || [])]);
    } catch (error) {
      console.error("Lỗi tải danh mục thuốc:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMedicines = useMemo(() => {
    let result = medicines;
    if (activeCategory !== "ALL") {
      result = result.filter((m) => m.category === activeCategory);
    }
    if (searchKw.trim() !== "") {
      result = result.filter((m) =>
        m.name.toLowerCase().includes(searchKw.toLowerCase()),
      );
    }
    return result;
  }, [medicines, searchKw, activeCategory]);

  const getInstructionLabel = (enumValue) => {
    switch (enumValue) {
      case "AFTER_MEAL":
        return "Sau ăn";
      case "BEFORE_MEAL":
        return "Trước ăn";
      case "WHEN_PAIN":
        return "Khi đau";
      default:
        return enumValue || "Chưa có cách dùng";
    }
  };

  const addedMedicines = selectedPrescription?.details || [];

  const renderHeader = () => (
    <View style={{ paddingHorizontal: 20 }}>
      {addedMedicines.length > 0 && (
        <View style={styles.addedMedContainer}>
          <Text style={styles.addedMedTitle}>
            Đã thêm ({addedMedicines.length})
          </Text>
          {addedMedicines.map((m, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.addedMedItem}
              activeOpacity={0.7}
              onPress={() =>
                onOpenInputForm({ ...m, detailId: m.id, id: m.medicine?.id })
              }
            >
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.addedMedName}>
                  {m.medicine?.name || "Thuốc không rõ tên"}
                </Text>
                <Text style={styles.addedMedNote}>
                  {getInstructionLabel(m.instruction)}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={styles.addedMedQtyBox}>
                  <Text style={styles.addedMedQtyText}>SL: {m.quantity}</Text>
                </View>
                <Feather
                  name="edit-2"
                  size={16}
                  color="#9CA3AF"
                  style={{ marginLeft: 8 }}
                />
              </View>
            </TouchableOpacity>
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
                <Text style={modalStyles.headerSubtitle} numberOfLines={1}>
                  CĐ: {selectedPrescription?.diagnosis}
                </Text>
              </View>
            </View>
          </View>

          {loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#0066FF" />
              <Text style={{ marginTop: 12, color: "#6B7280" }}>
                Đang tải danh mục thuốc...
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredMedicines}
              keyExtractor={(item) => item.id.toString()}
              ListHeaderComponent={renderHeader}
              contentContainerStyle={{ paddingBottom: 40 }}
              ListEmptyComponent={() => (
                <View style={{ alignItems: "center", marginTop: 40 }}>
                  <MaterialCommunityIcons
                    name="pill"
                    size={48}
                    color="#D1D5DB"
                  />
                  <Text style={{ color: "#6B7280", marginTop: 12 }}>
                    Không tìm thấy loại thuốc nào.
                  </Text>
                </View>
              )}
              renderItem={({ item }) => {
                const isAdded = addedMedicines.some(
                  (m) => Number(m.medicine?.id) === Number(item.id),
                );
                return (
                  <View style={styles.medCard}>
                    <View style={{ flex: 1, marginRight: 12 }}>
                      <Text style={styles.medName}>{item.name}</Text>
                      <Text style={styles.medUnit}>
                        Kho: {item.stock} | Giá:{" "}
                        {parseInt(item.unit_price || 0).toLocaleString("vi-VN")}
                        đ
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.addMedBtn,
                        isAdded && { backgroundColor: "#F3F4F6" },
                      ]}
                      onPress={() => onOpenInputForm(item)}
                    >
                      <Text
                        style={[
                          styles.addMedBtnText,
                          isAdded && { color: "#6B7280" },
                        ]}
                      >
                        {isAdded ? "Chỉnh sửa" : "+ Chọn"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default MedicineSearchModal;
