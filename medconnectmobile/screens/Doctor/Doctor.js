import { FlatList, Text, View } from "react-native";
import QueryArea from "../../components/QueryArea/QueryArea";
import { use, useEffect, useState } from "react";
import Apis, { endpoint } from "../../configs/Apis";
import ListCardItem from "../../components/ListCardItem/ListCardItem";
import Style from "./Style";

const Doctor = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    Apis.get(endpoint.doctors).then((response) => {
      setDoctors(response.data.results);
      console.log(response.data.results);
    });
  }, []);

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
      />
    </View>
  );
};

export default Doctor;
