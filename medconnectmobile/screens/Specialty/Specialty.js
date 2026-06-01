import { View, Text, FlatList } from "react-native";
import QueryArea from "../../components/QueryArea/QueryArea";
import { useEffect, useState } from "react";
import Apis, { endpoint } from "../../configs/Apis";
import ListItem from "../../components/ListItem/ListItem";
import { useNavigation } from "@react-navigation/native";

const Specialty = () => {
  const [specialties, setSpecialties] = useState([]);
  const nav = useNavigation();

  useEffect(() => {
    Apis.get(endpoint.specialties)
      .then((response) => {
        setSpecialties(response.data);
      })
      .catch((err) => {});
  }, []);

  const handleSpecialtyClick = (specialtyId) => {
    nav.navigate("Doctor", { specialtyId: specialtyId });
  };
  return (
    <View>
      <QueryArea />
      <FlatList
        data={specialties}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ListItem item={item} onClick={() => handleSpecialtyClick(item.id)} />
        )}
      />
    </View>
  );
};

export default Specialty;
