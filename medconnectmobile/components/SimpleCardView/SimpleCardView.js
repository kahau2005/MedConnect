import { View, Text, Image, TouchableOpacity } from "react-native";
import SimpleCardStyle from "./Style";

const SimpleCardView = ({
  title,
  description,
  image,
  style,
  clickProcess,
  price,
}) => {
  return (
    <TouchableOpacity
      style={[SimpleCardStyle.container, style]}
      onPress={clickProcess}
      activeOpacity={0.8}
    >
      <View style={SimpleCardStyle.imageContainer}>
        <Image source={image} style={SimpleCardStyle.image} />
      </View>
      <View style={SimpleCardStyle.infoContainer}>
        <Text style={SimpleCardStyle.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={SimpleCardStyle.description} numberOfLines={2}>
          {description}
        </Text>
        {price !== undefined && (
          <Text style={SimpleCardStyle.price}>{price}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default SimpleCardView;
