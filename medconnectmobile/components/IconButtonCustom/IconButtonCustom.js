import { Image, TouchableOpacity, View } from "react-native";
import { Button, Icon, IconButton, Text } from "react-native-paper";
import Style from "./Style";

const IconButtonCustom = ({ iconName, title }) => {
  return (
    <TouchableOpacity style={Style.container}>
      <IconButton
        style={Style.icon}
        icon={iconName}
        size={30}
        iconColor="#3d3d3d"
      />
      <Text style={Style.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default IconButtonCustom;
