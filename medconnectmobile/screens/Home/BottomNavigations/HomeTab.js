import { Image, ScrollView, Text, View } from "react-native";
import BannerCard from "../../../components/BannerCard/BannerCard";
import CallAction from "../../../components/CallAction/CallAction";
import SimpleCardView from "../../../components/SimpleCardView/SimpleCardView";
import HorizontalItemsView from "../../../components/HorizontalItemsView/HorizontalItemsView";
import ZaloPayTestButton from "../../../components/ZaloPayTest";
import CallActionBooking from "../../../components/CallActionBooking/CallActionBooking";
import Style from "../Style";
import { IconButton } from "react-native-paper";
import IconButtonCustom from "../../../components/IconButtonCustom/IconButtonCustom";

const doctors = [
  {
    id: 1,
    title: "Dr. John Doe",
    description: "Cardiologist",
    image: require("../../../assets/imgs/banner_doctor.png"),
    rating: 4.5,
  },
  {
    id: 2,
    title: "Dr. Jane Smith",
    description: "Dermatologist",
    image: require("../../../assets/imgs/banner_doctor.png"),
    rating: 4.7,
  },
  {
    id: 3,
    title: "Dr. Emily Johnson",
    description: "Pediatrician",
    image: require("../../../assets/imgs/banner_doctor.png"),
    rating: 4.8,
  },
];

const HomeTab = () => {
  return (
    <ScrollView>
      <View style={Style.background}>
        <Image
          style={Style.banner}
          source={require("../../../assets/imgs/banner_app.webp")}
        />
        <View style={Style.action}>
          <CallActionBooking />
          <View style={Style.icon_group}>
            <IconButtonCustom iconName="doctor" title="Bác sĩ" />
            <IconButtonCustom iconName="hospital" title="Chuyên khoa" />
            <IconButtonCustom iconName="face-agent" title="Dịch vụ" />
          </View>
        </View>
      </View>

      <HorizontalItemsView title={"Đánh giá cao"} items={doctors} />

      {/* <ZaloPayTestButton />
      <BannerCard />
      <CallAction
        title="STI Problems?"
        subtitle="Find suitable specialists here"
      />
      <HorizontalItemsView title={"Specialties"} items={specialties} />
      <HorizontalItemsView title={"Doctors"} items={specialties} /> */}
    </ScrollView>
  );
};

export default HomeTab;
