import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Alert, Platform, StyleSheet, Text, View } from "react-native";
import Home from "./screens/Home/Home";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomToolBar from "./components/ToolBar/CustomToolBar";
import Appointment from "./screens/Appointment/Appointment";
import { useEffect } from "react";
import {
  getMessaging,
  requestPermission,
  getToken,
  onMessage,
} from "@react-native-firebase/messaging";

const Stack = createNativeStackNavigator();

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
