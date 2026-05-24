import { View, Text, ScrollView } from "react-native";
import SimpleCardView from "../SimpleCardView/SimpleCardView";
import HorizontalItemsStyle from "./Style";

const HorizontalItemsView = ({ title, items }) => {
  const formatImageUrl = (url) => {
    if (!url) return null;
    if (!url.match(/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i)) {
      return `${url}.png`;
    }
    return url;
  };

  return (
    <View style={HorizontalItemsStyle.container}>
      <Text style={HorizontalItemsStyle.title}>{title}</Text>
      <ScrollView
        horizontal={true}
        contentContainerStyle={HorizontalItemsStyle.item_container}
        showsHorizontalScrollIndicator={false}
      >
        {items.map((item, index) => {
          const validImageUrl = formatImageUrl(item.image);

          return (
            <SimpleCardView
              key={index}
              title={item.title}
              description={item.description}
              image={
                !validImageUrl
                  ? require("../../assets/imgs/banner_doctor.png")
                  : { uri: validImageUrl }
              }
              price={item.price}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default HorizontalItemsView;
