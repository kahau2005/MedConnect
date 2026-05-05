import { View, Text, ScrollView } from "react-native";
import HorizontalItemsView from "../../components/HorizontalItemsView/HorizontalItemsView";
import ListItemView from "../../components/ListItemView/ListItemView";
import { useEffect, useState } from "react";
import Apis, { endpoint } from "../../configs/Apis";

const Service = () => {
  const [services, setServices] = useState([]);
  const [popularServices, setPopularServices] = useState([]);

  const fetchServices = async () => {
    try {
      let res = await Apis.get(endpoint.services);
      setServices(res.data.results);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchPopularServices = async () => {
    try {
      let res = await Apis.get(`${endpoint.services}popular`);
      console.log(
        "API response for popular services:",
        PopularServiceItemMapper(res.data),
      );
      setPopularServices(PopularServiceItemMapper(res.data));
    } catch (error) {
      console.error("Error fetching popular services:", error);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchPopularServices();
  }, []);

  useEffect(() => {
    console.log("---------Popular Services State (Sau khi re-render)---------");
    console.log(popularServices);
    console.log("---------------------------------------");
  }, [popularServices]);
  return (
    <ScrollView style={{ marginTop: 10 }}>
      <HorizontalItemsView title={"Dịch vụ nổi bật"} items={popularServices} />
      <View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 10,
            marginLeft: 15,
          }}
        >
          Dịch vụ khác
        </Text>
        <ListItemView items={services} clickProcess={() => {}} />
      </View>
    </ScrollView>
  );
};

export default Service;

const PopularServiceItemMapper = (rawData) => {
  return rawData.map((item) => ({
    title: item.name,
    description: item.description,
    image: item.image,
    price: item.price,
  }));
};
