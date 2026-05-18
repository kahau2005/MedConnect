import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Style from "./Style";

const SelectorModal = ({
  visible,
  onClose,
  title,
  data,
  onSelect,
  placeholder,
  isLoading, // Nhận trạng thái loading từ cha
  onLoadMore, // Hàm kích hoạt load trang tiếp theo khi cuộn xuống đáy
  hasMore, // Căn cứ để biết còn trang tiếp theo hay không
  displayFieldRow, // Hàm hoặc chuỗi quy định trường hiển thị (Xử lý vụ name vs first_name/last_name)
}) => {
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  // Xử lý render chuỗi hiển thị động cho từng hàng dữ liệu
  const renderItemText = (item) => {
    if (typeof displayFieldRow === "function") {
      return displayFieldRow(item);
    }
    return item[displayFieldRow] || item.name || "";
  };

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredData(data);
    } else {
      const lowerSearch = search.toLowerCase();
      setFilteredData(
        data.filter((item) => {
          const itemText = renderItemText(item).toLowerCase();
          return itemText.includes(lowerSearch);
        }),
      );
    }
  }, [search, data]);

  const handleClose = () => {
    setSearch("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={Style.overlay}
        activeOpacity={1}
        onPress={handleClose}
      >
        <View
          style={Style.modalContainer}
          onStartShouldSetResponder={() => true}
        >
          {/* Header */}
          <View style={Style.header}>
            <Text style={Style.title}>{title}</Text>
            <TouchableOpacity onPress={handleClose} style={Style.closeBtn}>
              <Feather name="x" size={22} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Thanh tìm kiếm */}
          <View style={Style.searchBar}>
            <Feather
              name="search"
              size={18}
              color="#999"
              style={Style.searchIcon}
            />
            <TextInput
              style={Style.searchInput}
              placeholder={placeholder || "Tìm kiếm..."}
              value={search}
              placeholderTextColor="#9CA3AF"
              onChangeText={setSearch}
            />
          </View>

          {/* Danh sách cuộn tích hợp phân trang */}
          <FlatList
            data={filteredData}
            keyExtractor={(item, index) =>
              item.id ? item.id.toString() : index.toString()
            }
            showsVerticalScrollIndicator={false}
            // Xử lý kéo xuống đáy để tải thêm trang mới
            onEndReached={() => {
              if (!isLoading && hasMore && onLoadMore && search.trim() === "") {
                onLoadMore();
              }
            }}
            onEndReachedThreshold={0.2}
            // Hiển thị vòng xoay loading dưới đáy danh sách
            ListFooterComponent={() => {
              if (isLoading && data.length > 0) {
                return (
                  <View style={{ paddingVertical: 12 }}>
                    <ActivityIndicator size="small" color="#0066FF" />
                  </View>
                );
              }
              return <View style={{ height: 20 }} />;
            }}
            // Trạng thái danh sách rỗng (Hiển thị loading lớn ban đầu hoặc thông báo trống)
            ListEmptyComponent={
              isLoading ? (
                <View style={{ paddingVertical: 40 }}>
                  <ActivityIndicator size="large" color="#0066FF" />
                </View>
              ) : (
                <Text style={Style.emptyText}>
                  Không tìm thấy dữ liệu phù hợp
                </Text>
              )
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={Style.itemRow}
                onPress={() => {
                  onSelect(item);
                  handleClose();
                }}
              >
                <Text style={Style.itemText}>{renderItemText(item)}</Text>
                <Feather name="chevron-right" size={16} color="#CCCCCC" />
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default SelectorModal;
