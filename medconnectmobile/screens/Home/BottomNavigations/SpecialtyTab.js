import { View } from "react-native";
import ListItemView from "../../../components/ListItemView/ListItemView";
import { use, useEffect, useState } from "react";
import Apis, { endpoint } from "../../../configs/Apis";

const SpecialtyTab = () => {
  const [view, setView] = useState("Specialties");
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const handleClick = async () => {
    let res = await Apis.get(`${endpoint.specialties}/`);
  };

  useEffect(async () => {
    try {
      let res = await Apis.get(endpoint.specialties);
      setSpecialties(res.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  // const doctors = [
  //   {
  //     title: "Dr. John Doe",
  //     description: "Cardiologist",
  //     image: require("../../../assets/imgs/banner_doctor.png"),
  //   },
  //   {
  //     title: "Dr. Jane Smith",
  //     description: "Dermatologist",
  //     image: require("../../../assets/imgs/banner_doctor.png"),
  //   },
  //   {
  //     title: "Dr. Emily Davis",
  //     description: "Neurologist",
  //     image: require("../../../assets/imgs/banner_doctor.png"),
  //   },
  // ];
  return (
    <View>
      {view === "Specialties" && (
        <ListItemView
          searchTitle={"Search for specialties"}
          items={specialties}
          clickProcess={handleClick}
        />
      )}
      {view === "Doctors" && (
        <ListItemView
          searchTitle={"Search for doctors"}
          items={doctors}
          clickProcess={() => {}}
        />
      )}
    </View>
  );
};
export default SpecialtyTab;
