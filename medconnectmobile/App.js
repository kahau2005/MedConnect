import "react-native-gesture-handler";
import messaging from "@react-native-firebase/messaging";
import { useEffect, useReducer } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Alert, Platform, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { OverlayProvider } from "stream-chat-expo";

import Home from "./screens/Home/Home";
import Appointment from "./screens/Appointment/Appointment";
import {
  configureFonts,
  MD3LightTheme,
  PaperProvider,
} from "react-native-paper";
import Specialty from "./screens/Specialty/Specialty";
import Doctor from "./screens/Doctor/Doctor";
import Service from "./screens/Service/Service";
import Payment from "./screens/Payment/Payment";
import ChatStream from "./screens/ChatStream/ChatStream";
import Login from "./screens/Login/Login";
import { UserContext } from "./contexts/UserContext";
import UserReducer from "./reducers/UserReducer";
import CallStream from "./screens/CallStream/CallStream";
import Register from "./screens/Register/Register";
import { registerDevice, requestUserPermission } from "./configs/FCMService";

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

  useEffect(() => {
    const unsubscribeTokenRefresh = messaging().onTokenRefresh(
      async (newToken) => {
        console.log("FCM Token đã được làm mới: ", newToken);

        if (user && user.access_token) {
          await registerDevice(newToken, user.access_token);
        }
      },
    );

    const unsubscribeForeground = messaging().onMessage(
      async (remoteMessage) => {
        Alert.alert(
          remoteMessage.notification?.title || "Thông báo",
          remoteMessage.notification?.body || "",
        );
      },
    );

    return () => {
      unsubscribeTokenRefresh();
      unsubscribeForeground();
    };
  }, [user]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <OverlayProvider>
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
                  <Stack.Screen name="CallStream" component={CallStream} />
                  <Stack.Screen name="Login" component={Login} />
                  <Stack.Screen name="Register" component={Register} />
                </Stack.Navigator>
              </NavigationContainer>
            </PaperProvider>
          </UserContext.Provider>
        </OverlayProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
