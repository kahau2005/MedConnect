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
import Specialty from "./screens/Specialty/Specialty";
import { SafeAreaView } from "react-native-safe-area-context";
import Doctor from "./screens/Doctor/Doctor";

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
  useEffect(() => {
    const setupFirebase = async () => {
      try {
        const messagingInstance = getMessaging();

        const authStatus = await requestPermission(messagingInstance);

        const isAuthorized = authStatus === 1 || authStatus === 2;

        if (isAuthorized) {
          const token = await getToken(messagingInstance);
          console.log("========== FCM TOKEN ==========");
          console.log(token);
          console.log("===============================");

          const unsubscribe = onMessage(
            messagingInstance,
            async (remoteMessage) => {
              Alert.alert(
                remoteMessage.notification?.title || "MedConnect",
                remoteMessage.notification?.body || "Bạn có thông báo mới!",
              );
            },
          );

          return unsubscribe;
        } else {
          console.log("Người dùng đã từ chối nhận thông báo.");
        }
      } catch (error) {
        console.error("Lỗi setup FCM:", error);
      }
    };

    setupFirebase();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
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
            <Stack.Screen name="Specialty" component={Specialty} />
            <Stack.Screen name="Doctor" component={Doctor} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaView>
  );
}
