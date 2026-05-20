import { View, Text, FlatList } from "react-native";
import QueryArea from "../../components/QueryArea/QueryArea";
import { useEffect, useState } from "react";
import Apis, { endpoint } from "../../configs/Apis";
import ListItem from "../../components/ListItem/ListItem";

const Specialty = () => {
  const [specialties, setSpecialties] = useState([]);

  useEffect(() => {
    Apis.get(endpoint.specialties)
      .then((response) => {
        setSpecialties(response.data);
      })
      .catch((error) => {
        console.error("Error fetching specialties:", error);
      });
  }, []);
  return (
    <View>
      <QueryArea />
      <FlatList
        data={specialties}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ListItem item={item} />}
      />
    </View>
  );
};

export default Specialty;
