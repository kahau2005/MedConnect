import { View, Text, ScrollView } from "react-native";
import SimpleCardView from "../SimpleCardView/SimpleCardView";
import HorizontalItemsStyle from "./Style";

const HorizontalItemsView = ({ title, items }) => {
  return (
    <View style={HorizontalItemsStyle.container}>
      <Text style={HorizontalItemsStyle.title}>{title}</Text>
      <ScrollView
        horizontal={true}
        contentContainerStyle={HorizontalItemsStyle.item_container}
        showsHorizontalScrollIndicator={false}
      >
        {items.map((item, index) => (
          <SimpleCardView
            key={index}
            title={item.title}
            description={item.description}
            image={item.image}
            price={item.price}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default HorizontalItemsView;
