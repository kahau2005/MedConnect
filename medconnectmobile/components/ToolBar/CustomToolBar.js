import { Image, View, Text } from "react-native";
import ToolBarStyles from "./style";

const CustomToolBar = () => {
  return (
    <View style={ToolBarStyles.container}>
      <View>
        <Text>Welcome, Admin!</Text>
      </View>
      <View style={ToolBarStyles.toolbar_actions_container}>
        <Image
          style={ToolBarStyles.toolbar_action}
          source={require("../../assets/icons/calendar.png")}
        />
        <Image
          style={[ToolBarStyles.toolbar_action, ToolBarStyles.action_more]}
          source={require("../../assets/icons/more.png")}
        />
      </View>
    </View>
  );
};
export default CustomToolBar;
