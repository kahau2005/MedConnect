import { TouchableOpacity, View, Text } from "react-native";
import CallActionStyles from "./Style";
import { IconButton } from "react-native-paper";

const CallAction = ({ title, subtitle }) => {
  return (
    <View style={CallActionStyles.container}>
      <View>
        <Text style={CallActionStyles.title}>{title}</Text>
        <Text style={CallActionStyles.subtitle}>{subtitle}</Text>
      </View>

      <IconButton
        style={CallActionStyles.button}
        icon="chevron-right"
        size={32} // Tăng kích thước icon ở đây (Mặc định thường là 24)
        onPress={() => console.log("Pressed")}
      />
    </View>
  );
};

export default CallAction;
