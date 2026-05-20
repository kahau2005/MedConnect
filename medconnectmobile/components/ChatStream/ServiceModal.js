import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { modalStyles as styles } from "./Style";
import { UserContext } from "../../contexts/UserContext";
import Apis, { authApis, endpoint } from "../../configs/Apis";

const ServiceModal = ({ visible, onClose, appointmentId }) => {
  const [user] = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [assignedServices, setAssignedServices] = useState([]);
  const [showList, setShowList] = useState(false);
  const [searchKw, setSearchKw] = useState("");
  const [data, setData] = useState({
    serviceId: null,
    quantity: "1",
    detailId: null,
  });

  useEffect(() => {
    if (visible && user) {
      setSearchKw("");
      fetchData();
    }
  }, [visible]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resCatalog, resAssigned] = await Promise.all([
        Apis.get(endpoint.services),
        authApis(user.access_token).get(endpoint.service(appointmentId)),
      ]);
      setServices(resCatalog.data);
      setAssignedServices(resAssigned.data);
      setShowList(resAssigned.data.length === 0);
    } catch (error) {
      console.error("Lỗi tải danh mục dịch vụ:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async () => {
    if (!data.serviceId) {
      Alert.alert("Lỗi", "Vui lòng chọn dịch vụ!");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        service: Number(data.serviceId),
        quantity: Number(data.quantity || 1),
      };
      if (data.detailId) {
        await authApis(user.access_token).patch(
          `/appointment-services/${data.detailId}/`,
          payload,
        );
      } else {
        await authApis(user.access_token).post(
          endpoint.service(appointmentId),
          payload,
        );
      }
      Alert.alert("Thành công", "Đã lưu dịch vụ thành công.");
      setData({ serviceId: null, quantity: "1", detailId: null });
      fetchData();
      setShowList(false);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể thêm dịch vụ.");
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchKw.toLowerCase()),
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={[styles.formModal, { flex: 0.9, paddingHorizontal: 20 }]}>
          <View style={styles.formHeader}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {showList && assignedServices.length > 0 && (
                <TouchableOpacity
                  onPress={() => setShowList(false)}
                  style={{ marginRight: 12 }}
                >
                  <Feather name="arrow-left" size={24} color="#111827" />
                </TouchableOpacity>
              )}
              <Text style={styles.formTitle}>
                {showList ? "Chọn dịch vụ" : "Dịch vụ đã chỉ định"}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {!showList && (
            <FlatList
              data={assignedServices}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const fullCatalogInfo = services.find(
                  (s) => s.id === item.service?.id,
                );
                const isEditingThis = String(data.detailId) === String(item.id);

                return (
                  <View
                    style={{
                      backgroundColor: isEditingThis ? "#EBF4FF" : "#F9FAFB",
                      borderRadius: 14,
                      padding: 12,
                      marginBottom: 10,
                      borderWidth: 1,
                      borderColor: isEditingThis ? "#0066FF" : "#E5E7EB",
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Image
                        source={{
                          uri: fullCatalogInfo?.image?.includes("http")
                            ? fullCatalogInfo.image
                            : `https://res.cloudinary.com/dsc8rzpbg/${fullCatalogInfo?.image}`,
                        }}
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 8,
                          backgroundColor: "#E5E7EB",
                        }}
                        resizeMode="cover"
                      />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: "600",
                            color: "#111827",
                          }}
                        >
                          {item.service?.name}
                        </Text>
                        <Text
                          style={{
                            fontSize: 13,
                            color: "#6B7280",
                            marginTop: 2,
                          }}
                        >
                          Đơn giá:{" "}
                          {parseInt(item.unit_price || 0).toLocaleString(
                            "vi-VN",
                          )}
                          đ
                        </Text>
                      </View>
                      {!isEditingThis && (
                        <TouchableOpacity
                          onPress={() =>
                            setData({
                              serviceId: String(item.service?.id),
                              quantity: String(item.quantity),
                              detailId: item.id,
                            })
                          }
                          style={{
                            padding: 8,
                            backgroundColor: "#FFF",
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: "#D1D5DB",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 12,
                              color: "#4B5563",
                              fontWeight: "600",
                            }}
                          >
                            Sửa SL ({item.quantity})
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    {isEditingThis && (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: 12,
                          paddingTop: 12,
                          borderTopWidth: 1,
                          borderTopColor: "#D1D5DB",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 13,
                            color: "#0066FF",
                            fontWeight: "700",
                          }}
                        >
                          Chỉnh sửa lượng:
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "#FFF",
                            borderRadius: 6,
                            borderWidth: 1,
                            borderColor: "#0066FF",
                          }}
                        >
                          <TouchableOpacity
                            style={{ padding: 6 }}
                            onPress={() =>
                              setData({
                                ...data,
                                quantity: String(
                                  Math.max(1, parseInt(data.quantity) - 1),
                                ),
                              })
                            }
                          >
                            <Feather name="minus" size={14} color="#111827" />
                          </TouchableOpacity>
                          <Text
                            style={{
                              width: 30,
                              textAlign: "center",
                              fontSize: 14,
                              fontWeight: "bold",
                              color: "#111827",
                            }}
                          >
                            {data.quantity}
                          </Text>
                          <TouchableOpacity
                            style={{ padding: 6 }}
                            onPress={() =>
                              setData({
                                ...data,
                                quantity: String(parseInt(data.quantity) + 1),
                              })
                            }
                          >
                            <Feather name="plus" size={14} color="#111827" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                );
              }}
              ListFooterComponent={() => (
                <View style={{ marginTop: 10 }}>
                  {data.detailId && (
                    <TouchableOpacity
                      style={[styles.submitBtn, { marginBottom: 12 }]}
                      onPress={handleAddService}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator color="#FFF" />
                      ) : (
                        <Text style={styles.submitBtnText}>
                          Cập nhật số lượng
                        </Text>
                      )}
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#F3F4F6",
                      padding: 14,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: "#D1D5DB",
                      borderStyle: "dashed",
                    }}
                    onPress={() => {
                      setShowList(true);
                      setData({
                        serviceId: null,
                        quantity: "1",
                        detailId: null,
                      });
                    }}
                  >
                    <Feather
                      name="plus-circle"
                      size={18}
                      color="#0066FF"
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={{
                        color: "#0066FF",
                        fontSize: 15,
                        fontWeight: "700",
                      }}
                    >
                      Thêm dịch vụ khác
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}

          {showList && (
            <>
<<<<<<< HEAD
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#F3F4F6",
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  height: 46,
                  marginBottom: 12,
                }}
              >
                <Feather name="search" size={20} color="#9CA3AF" />
                <TextInput
=======
              <View style={{ marginBottom: 12 }}>
                <View
>>>>>>> a4e8d23d4bde3bb9c632b3ed6ce3ce01aacfb7fd
                  style={{
                    flex: 1,
                    marginLeft: 8,
                    fontSize: 15,
                    color: "#111827",
                  }}
                  placeholder="Tìm tên dịch vụ..."
                  value={searchKw}
                  onChangeText={setSearchKw}
                />
              </View>
              <FlatList
                data={filteredServices}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                  const isSelected = String(data.serviceId) === String(item.id);
                  const alreadyAdded = assignedServices.some(
                    (as) => as.service?.id === item.id,
                  );
                  return (
                    <TouchableOpacity
                      activeOpacity={alreadyAdded ? 1 : 0.7}
                      onPress={() =>
                        !alreadyAdded &&
                        setData({
                          serviceId: String(item.id),
                          quantity: "1",
                          detailId: null,
                        })
                      }
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 12,
                        marginBottom: 10,
                        borderWidth: 1.5,
                        borderColor: isSelected ? "#0066FF" : "#E5E7EB",
                        backgroundColor: alreadyAdded
                          ? "#F3F4F6"
                          : isSelected
                            ? "#EBF4FF"
                            : "#FFFFFF",
                        borderRadius: 12,
                        opacity: alreadyAdded ? 0.6 : 1,
                      }}
                    >
                      <Image
                        source={{
                          uri: item.image?.includes("http")
                            ? item.image
                            : `https://res.cloudinary.com/dsc8rzpbg/${item.image}`,
                        }}
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 8,
                          backgroundColor: "#F3F4F6",
                        }}
                      />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: "600",
                            color: "#111827",
                          }}
                        >
                          {item.name}
                        </Text>
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: "bold",
                            color: "#059669",
                          }}
                        >
                          {parseInt(item.price).toLocaleString("vi-VN")}đ
                        </Text>
                      </View>
                      <View style={{ paddingLeft: 10 }}>
                        {alreadyAdded ? (
                          <Text
                            style={{
                              fontSize: 12,
                              color: "#6B7280",
                              fontWeight: "600",
                            }}
                          >
                            Đã thêm
                          </Text>
                        ) : isSelected ? (
                          <MaterialCommunityIcons
                            name="check-circle"
                            size={24}
                            color="#0066FF"
                          />
                        ) : (
                          <MaterialCommunityIcons
                            name="circle-outline"
                            size={24}
                            color="#D1D5DB"
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
              <View
                style={{
                  borderTopWidth: 1,
                  borderTopColor: "#E5E7EB",
                  paddingTop: 16,
                  marginTop: 8,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: "#374151",
                      flex: 1,
                    }}
                  >
                    Số lượng:
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: "#E5E7EB",
                      borderRadius: 8,
                    }}
                  >
                    <TouchableOpacity
                      style={{ padding: 10 }}
                      onPress={() =>
                        setData({
                          ...data,
                          quantity: String(
                            Math.max(1, parseInt(data.quantity) - 1),
                          ),
                        })
                      }
                    >
                      <Feather name="minus" size={18} color="#4B5563" />
                    </TouchableOpacity>
                    <TextInput
                      style={{
                        width: 40,
                        textAlign: "center",
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "#111827",
                      }}
                      keyboardType="numeric"
                      value={data.quantity}
                      onChangeText={(t) => setData({ ...data, quantity: t })}
                    />
                    <TouchableOpacity
                      style={{ padding: 10 }}
                      onPress={() =>
                        setData({
                          ...data,
                          quantity: String(parseInt(data.quantity) + 1),
                        })
                      }
                    >
                      <Feather name="plus" size={18} color="#4B5563" />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  style={[
                    styles.submitBtn,
                    !data.serviceId && { backgroundColor: "#9CA3AF" },
                  ]}
                  onPress={handleAddService}
                  disabled={loading || !data.serviceId}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.submitBtnText}>Thêm dịch vụ</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ServiceModal;
