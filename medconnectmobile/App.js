import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Text, View } from "react-native";
import Home from "./screens/Home/Home";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomToolBar from "./components/ToolBar/CustomToolBar";
import Appointment from "./screens/Appointment/Appointment";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: true,
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Appointment" component={Appointment} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
