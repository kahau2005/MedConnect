import { ScrollView, Text, View } from "react-native";
import BannerCard from "../../../components/BannerCard/BannerCard";
import CallAction from "../../../components/CallAction/CallAction";
import SimpleCardView from "../../../components/SimpleCardView/SimpleCardView";
import HorizontalItemsView from "../../../components/HorizontalItemsView/HorizontalItemsView";

const HomeTab = () => {
  const specialties = [
    {
      title: "Cardiology",
      description: "Heart specialists",
      image: require("../../../assets/imgs/banner_doctor.png"),
    },
    {
      title: "Dermatology",
      description: "Skin specialists",
      image: require("../../../assets/imgs/banner_doctor.png"),
    },
    {
      title: "Neurology",
      description: "Brain specialists",
      image: require("../../../assets/imgs/banner_doctor.png"),
    },
    {
      title: "Pediatrics",
      description: "Child specialists",
      image: require("../../../assets/imgs/banner_doctor.png"),
    },
  ];
  return (
    <ScrollView>
      <BannerCard />
      <CallAction
        title="STI Problems?"
        subtitle="Find suitable specialists here"
      />
      <HorizontalItemsView title={"Specialties"} items={specialties} />
      <HorizontalItemsView title={"Doctors"} items={specialties} />
    </ScrollView>
  );
};

export default HomeTab;
