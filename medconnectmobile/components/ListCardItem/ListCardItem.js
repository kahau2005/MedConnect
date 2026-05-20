import { Image, Text, TouchableOpacity, View } from "react-native";
import Style from "./Style";

const ListCardItem = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      style={Style.cardContainer}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item?.avatar }}
        style={Style.image}
        resizeMode="cover"
      />
      <View style={Style.textContainer}>
        <Text style={Style.nameText} numberOfLines={2}>
          {item?.first_name} {item?.last_name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ListCardItem;
