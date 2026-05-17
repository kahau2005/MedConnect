import "react-native-gesture-handler";
import React, { useCallback, useEffect, useReducer, useState } from "react";
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
import Specialty from "./screens/Specialty/Specialty";
import { SafeAreaView } from "react-native-safe-area-context";
import Doctor from "./screens/Doctor/Doctor";
import Service from "./screens/Service/Service";
import Payment from "./screens/Payment/Payment";
import ChatStream from "./screens/ChatStream/ChatStream";

import {
  Chat as StreamChatProvider,
  OverlayProvider,
} from "stream-chat-react-native";
import {
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import Apis, { endpoint } from "./configs/Apis";
import Login from "./screens/Login/Login";
import { UserContext } from "./contexts/UserContext";
import UserReducer from "./reducers/UserReducer";

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
  const [user, dispatch] = useReducer(UserReducer, null);
  return (
    <UserContext.Provider value={[user, dispatch]}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: true,
              headerTitleAlign: "center",
            }}
          >
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Appointment" component={Appointment} />
            <Stack.Screen name="Specialty" component={Specialty} />
            <Stack.Screen name="Doctor" component={Doctor} />
            <Stack.Screen name="Service" component={Service} />
            <Stack.Screen name="Payment" component={Payment} />
            <Stack.Screen name="ChatStream" component={ChatStream} />
            <Stack.Screen name="Login" component={Login} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </UserContext.Provider>
  );
}
