import {
  Text,
  TouchableHighlight,
  TouchableNativeFeedbackBase,
  TouchableOpacity,
} from "react-native";
import { View } from "react-native";
import "./Style";
import { Button, IconButton } from "react-native-paper";
import Style from "./Style";
import { useNavigation } from "@react-navigation/native";

const CallActionBooking = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={Style.container}
      onPress={() => {
        navigation.navigate("Appointment");
      }}
    >
      <Text style={Style.text}>Đặt lịch khám ngay</Text>
      <IconButton style={Style.button} icon="calendar-plus" size={30} />
    </TouchableOpacity>
  );
};

export default CallActionBooking;
