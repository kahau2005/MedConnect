import { View, Text } from "react-native";
import HorizontalItemsView from "../../../components/HorizontalItemsView/HorizontalItemsView";
import { List } from "react-native-paper";
import ListItemView from "../../../components/ListItemView/ListItemView";
import { useEffect, useState } from "react";
import Apis, { endpoint } from "../../../configs/Apis";

const ServicesTab = () => {
  const [services, setServices] = useState([]);
  const [popularServices, setPopularServices] = useState([]);

  const fetchServices = async () => {
    try {
      let res = await Apis.get(endpoint.services);
      setServices(res.data.results);
<<<<<<< HEAD
    } catch (error) {
      console.error("Lỗi dịch vụ: ", error);
    }
=======
    } catch (error) {}
>>>>>>> 7e990d68f4b0562b8843f39066b1aca59e651b55
  };

  const fetchPopularServices = async () => {
    try {
      let res = await Apis.get(`${endpoint.services}popular`);
      setPopularServices(PopularServiceItemMapper(res.data));
<<<<<<< HEAD
    } catch (error) {
      console.error("Lỗi dịch vụ phổ biến!");
    }
=======
    } catch (error) {}
>>>>>>> 7e990d68f4b0562b8843f39066b1aca59e651b55
  };

  useEffect(() => {
    fetchServices();
    fetchPopularServices();
  }, []);

  return (
    <CollapsingToolBar
      headerMaxHeight={220}
      headerMinHeight={80}
      backgroundColor="#3E64FF"
      headerComponent={<CustomToolBar title="Các Dịch Vụ" />}
    >
      <View style={{ marginTop: 10 }}>
        <HorizontalItemsView
          title={"Dịch vụ nổi bật"}
          items={popularServices}
        />
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
      </View>
    </CollapsingToolBar>
  );
};

export default ServicesTab;

const PopularServiceItemMapper = (rawData) => {
  return rawData.map((item) => ({
    title: item.name,
    description: item.description,
    image: item.image,
    price: item.price,
  }));
};
