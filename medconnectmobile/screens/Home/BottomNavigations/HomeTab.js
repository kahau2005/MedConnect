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
      image:
        "http://res.cloudinary.com/dsc8rzpbg/image/upload/Orthopedic-pana_feiopk.png",
    },
    {
      title: "Dermatology",
      description: "Skin specialists",
      image:
        "http://res.cloudinary.com/dsc8rzpbg/image/upload/Orthopedic-pana_feiopk.png",
    },
    {
      title: "Neurology",
      description: "Brain specialists",
      image:
        "http://res.cloudinary.com/dsc8rzpbg/image/upload/Orthopedic-pana_feiopk.png",
    },
    {
      title: "Pediatrics",
      description: "Child specialists",
      image:
        "http://res.cloudinary.com/dsc8rzpbg/image/upload/Orthopedic-pana_feiopk.png",
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
