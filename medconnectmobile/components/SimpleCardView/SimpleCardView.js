import { View, Text, Image, TouchableOpacity } from "react-native";
import SimpleCardStyle from "./Style";

const SimpleCardView = ({ title, description, image, style, clickProcess }) => {
  return (
    <TouchableOpacity
      style={[SimpleCardStyle.container, style]}
      onPress={clickProcess}
    >
      <Image source={image} style={SimpleCardStyle.image} />
      <Text style={SimpleCardStyle.title}>{title}</Text>
      <Text style={SimpleCardStyle.description}>{description}</Text>
    </TouchableOpacity>
  );
};

export default SimpleCardView;
