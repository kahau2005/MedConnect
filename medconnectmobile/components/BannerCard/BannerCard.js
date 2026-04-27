import React from "react";
import { Image, Text, View } from "react-native";
import BannerCardStyles from "./style";

const BannerCard = () => {
  return (
    <View style={BannerCardStyles.container}>
      <View style={BannerCardStyles.title_container}>
        <Text style={BannerCardStyles.banner_title}>Healthcare</Text>
        <Text style={BannerCardStyles.banner_subtitle}>
          Book your next online appointments
        </Text>
      </View>
      <View style={BannerCardStyles.banner_image_container}>
        <Image
          source={require("../../assets/imgs/banner_doctor.png")}
          style={BannerCardStyles.banner_image}
        />
      </View>
    </View>
  );
};

export default BannerCard;
