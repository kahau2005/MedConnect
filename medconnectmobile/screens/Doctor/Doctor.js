import { FlatList, Text, View } from "react-native";
import QueryArea from "../../components/QueryArea/QueryArea";
import { use, useEffect, useState } from "react";
import Apis, { endpoint } from "../../configs/Apis";
import ListCardItem from "../../components/ListCardItem/ListCardItem";
import Style from "./Style";
import LoadingModal from "../../components/LoadingModel/LoadingModel";
import { useRoute } from "@react-navigation/native";

const Doctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  const [kw, setKw] = useState("");

  const route = useRoute();
  const { spectialtyId } = route.params || "";

  const loadDoctor = async () => {
    try {
      setLoading(true);
      let result = await Apis.get(
        `${endpoint.doctors}?offset=${offset}&specialty_id=${spectialtyId}`,
      );
      setDoctors([...doctors, ...result.data.results]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading) setOffset((prev) => prev + 8);
  };

  useEffect(() => {
    loadDoctor();
  }, [offset, kw]);

  const renderItem = ({ item }) => (
    <ListCardItem
      item={item}
      onPress={() => console.log("Pressed doctor:", item.id)}
    />
  );

  return (
    <View style={Style.container}>
      <QueryArea showSearch={true} searchPlaceholder="Tìm kiếm bác sĩ" />
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
      />
      {loading && <LoadingModal />}
    </View>
  );
};

export default Doctor;
