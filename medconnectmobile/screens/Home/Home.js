import { Text, View } from "react-native";
import BannerCard from "../../components/BannerCard/BannerCard";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeTab from "./BottomNavigations/HomeTab";
import { Icon } from "react-native-paper";
import ServicesTab from "./BottomNavigations/ServicesTab";
import { SafeAreaView } from "react-native-safe-area-context";
import "./Style";
import AllAppointmentTab from "./BottomNavigations/AllAppointmentTab/AllAppointmentTab";

const Home = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeTab}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon source="home" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Tư vấn"
        component={AllAppointmentTab}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon source="briefcase" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={HomeTab}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon source="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Home;
