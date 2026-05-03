import React, { useCallback } from "react"; // Sửa lỗi 1
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Platform, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";

import Home from "./screens/Home/Home";
import Appointment from "./screens/Appointment/Appointment";
import {
  configureFonts,
  MD3LightTheme,
  PaperProvider,
} from "react-native-paper";

const Stack = createNativeStackNavigator();

const fontConfig = {
  customVariant: {
    fontFamily: Platform.select({
      android: "Roboto",
      web: "Roboto",
      ios: "System",
      default: "Roboto",
    }),
    fontWeight: "400",
    letterSpacing: 0.5,
    lineHeight: 22,
    fontSize: 20,
  },
};

const theme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: fontConfig }),
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Appointment" component={Appointment} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
