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
  console.log("SimpleCardView Props:", { title, description, image, price });
  return (
    <TouchableOpacity
      style={[SimpleCardStyle.container, style]}
      onPress={clickProcess}
    >
      <Image source={image} style={SimpleCardStyle.image} />
      <Text style={SimpleCardStyle.title}>{title}</Text>
      <Text style={SimpleCardStyle.description}>{description}</Text>
      {price !== undefined && (
        <Text style={SimpleCardStyle.price}>{price} VNĐ</Text>
      )}
    </TouchableOpacity>
  );
};

export default SimpleCardView;
