import { Image, TouchableOpacity, View } from "react-native";
import { Button, Icon, IconButton, Text } from "react-native-paper";
import Style from "./Style";

const IconButtonCustom = ({ iconName, title, setItemClicked }) => {
  return (
    <TouchableOpacity
      style={Style.container}
      onPress={setItemClicked ? setItemClicked : () => {}}
    >
      <IconButton
        style={Style.icon}
        icon={iconName}
        size={36}
        iconColor="white"
        pointerEvents="none"
      />
      <Text style={Style.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default IconButtonCustom;
