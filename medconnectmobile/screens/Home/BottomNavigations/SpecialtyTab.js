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

  const [specialtySelected, setSpecialtySelectedId] = useState({});
  const [doctorSelected, setDoctorSelectedId] = useState({});

  const handleBackAction = () => {
    setView("Specialties");
  };

  const handleDoctorClick = (doctor) => {
    setDoctorSelectedId(doctor);
    navigation.navigate("Appointment", {
      doctor: doctor,
      specialty: specialtySelected,
    });
  };

  const handleSpecialtyClick = async (specialty) => {
    try {
      let res = await Apis.get(
        endpoint.doctors + `?specialty_id=${specialty.id}&offset=0`,
      );
      const formattedDoctors = res.data.results.map((doctor) => ({
        id: doctor.user_id,
        name: `${doctor.last_name} ${doctor.first_name}`,
        description: doctor.background,
        image: doctor.avatar,
      }));
      setDoctors(formattedDoctors);
      setView("Doctors");
      setSpecialtySelectedId({ id: specialty.id, value: specialty.name });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        let res = await Apis.get(endpoint.specialties);
        setSpecialties(res.data.results);
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
          <ListItemView
            items={specialties}
            clickProcess={handleSpecialtyClick}
          />
        )}
        {view === "Doctors" && (
          <ListItemView items={doctors} clickProcess={handleDoctorClick} />
        )}
      </View>
    </CollapsingToolBar>
  );
};
export default SpecialtyTab;
