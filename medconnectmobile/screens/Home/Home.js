import { Text, View } from "react-native";
import BannerCard from "../../components/BannerCard/BannerCard";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeTab from "./BottomNavigations/HomeTab";
import { Icon } from "react-native-paper";
import SpecialtyTab from "./BottomNavigations/SpecialtyTab";
import ServicesTab from "./BottomNavigations/ServicesTab";
import { SafeAreaView } from "react-native-safe-area-context";
import "./Style";

const Home = () => {
  const Tab = createBottomTabNavigator();
  return (
    <SafeAreaView style={{ flex: 1 }}>
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
          name="Specialty"
          component={SpecialtyTab}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon source="book-variant" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Services"
          component={ServicesTab}
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
    </SafeAreaView>
  );
};

export default Home;
