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

const CallActionBooking = () => {
  return (
    <TouchableOpacity style={Style.container}>
      <Text style={Style.text}>Đặt lịch khám ngay</Text>
      <IconButton
        style={Style.button}
        icon="calendar-plus"
        size={30}
        onPress={() => console.log("Booking pressed")}
      />
    </TouchableOpacity>
  );
};

export default CallActionBooking;
