import { ActivityIndicator, Alert, FlatList, Text, View } from "react-native";
import QueryArea from "../../components/QueryArea/QueryArea";
import { useEffect, useState } from "react";
import Apis, { endpoint } from "../../configs/Apis";
import ListCardItem from "../../components/ListCardItem/ListCardItem";
import Style from "./Style";
import { useRoute } from "@react-navigation/native";

const Doctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [kw, setKw] = useState("");
  const [hasMore, setHasMore] = useState(true);

  const route = useRoute();
  const { specialtyId } = route?.params || {};

  useEffect(() => {
    const handler = setTimeout(() => {
      setKw(searchQuery);
      setOffset(0);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const loadDoctor = async () => {
    if (loading) return;
    if (offset > 0 && !hasMore) return;

    try {
      setLoading(true);
      let url = `${endpoint.doctors}?offset=${offset}`;

      if (specialtyId) {
        url += `&specialty_id=${specialtyId}`;
      }
      if (kw) {
        url += `&search=${kw}`;
      }

      let result = await Apis.get(url);
      const newDoctors = result.data.results || [];
      setDoctors((prev) =>
        offset === 0 ? newDoctors : [...prev, ...newDoctors],
      );
      setHasMore(result.data.next !== null);
    } catch (error) {
      const errData = error?.response?.data?.err;
      const errorMessage = Array.isArray(errData)
        ? errData[0]
        : errData || "Không xác định!";
      Alert.alert("Lỗi", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore && doctors.length > 0) {
      setOffset((prev) => prev + 8);
    }
  };

  useEffect(() => {
    loadDoctor();
  }, [offset, kw, specialtyId]);

  const renderItem = ({ item }) => <ListCardItem item={item} />;

  return (
    <View style={Style.container}>
      <QueryArea
        showSearch={true}
        searchPlaceholder="Tìm kiếm bác sĩ"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={doctors}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
        numColumns={2}
        contentContainerStyle={Style.listContent}
        columnWrapperStyle={Style.row}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator
              size="small"
              color="#0066FF"
              style={{ marginVertical: 10 }}
            />
          ) : null
        }
      />
    </View>
  );
};

export default Doctor;
