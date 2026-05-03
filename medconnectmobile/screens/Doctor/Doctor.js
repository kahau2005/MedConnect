import { Text, View } from "react-native";
import QueryArea from "../../components/QueryArea/QueryArea";
import { use, useEffect, useState } from "react";
import Apis, { endpoint } from "../../configs/Apis";
import ListCardItem from "../../components/ListCardItem/ListCardItem";

const Doctor = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    Apis.get(endpoint.doctors).then((response) => {
      setDoctors(response.data.results);
      console.log(response.data.results);
    });
  }, []);

  return (
    <View>
      <QueryArea showSearch={true} searchPlaceholder="Tìm kiếm bác sĩ" />
      <ListCardItem item={doctors[4]} />
    </View>
  );
};

export default Doctor;
