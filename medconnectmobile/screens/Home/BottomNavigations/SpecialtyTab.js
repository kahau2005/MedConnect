import { View, Text, Animated, StyleSheet, Dimensions } from "react-native";
import ListItemView from "../../../components/ListItemView/ListItemView";
import { useEffect, useState } from "react";
import Apis, { endpoint } from "../../../configs/Apis";
import CollapsingToolBar from "../../../components/CollapsingToolBar/CollapsingToolBar";
import CustomToolBar from "../../../components/ToolBar/CustomToolBar";

const SpecialtyTab = ({ navigation }) => {
  const [view, setView] = useState("Specialties");
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const handleBackAction = () => {
    setView("Specialties");
  };

  const handleClick = async (id) => {
    try {
      let res = await Apis.get(endpoint.specialties + `${id}/doctors`);
      const formattedDoctors = res.data.map((doctor) => ({
        id: doctor.user_id,
        name: `${doctor.last_name} ${doctor.first_name}`,
        description: doctor.background,
        image: doctor.avatar,
      }));
      setDoctors(formattedDoctors);
      setView("Doctors");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        let res = await Apis.get(endpoint.specialties);
        setSpecialties(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSpecialties();
  }, []);

  return (
    <CollapsingToolBar
      headerMaxHeight={220}
      headerMinHeight={80}
      backgroundColor="#3E64FF"
      headerComponent={
        <CustomToolBar title="Các Chuyên Khoa" backAction={handleBackAction} />
      }
    >
      <View style={{ marginTop: 10 }}>
        {view === "Specialties" && (
          <ListItemView items={specialties} clickProcess={handleClick} />
        )}
        {view === "Doctors" && (
          <ListItemView
            items={doctors}
            clickProcess={() => {
              navigation.navigate("Appointment", { doctorId: doctors.id });
            }}
          />
        )}
      </View>
    </CollapsingToolBar>
  );
};
export default SpecialtyTab;
