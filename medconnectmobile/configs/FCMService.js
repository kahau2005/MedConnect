import {
  getMessaging,
  requestPermission,
  getToken,
  deleteToken,
} from "@react-native-firebase/messaging";
import { Alert, Platform } from "react-native";
import { authApis, endpoint } from "./Apis";

export const requestUserPermission = async (accessToken) => {
  try {
    const messaging = getMessaging();
    const authStatus = await requestPermission(messaging);
    const enabled = authStatus === 1 || authStatus === 2;

    if (enabled) {
      await getFcmToken(accessToken);
    } else {
      Alert.alert("Bị từ chối quyền");
    }
  } catch (err) {}
};

export const getFcmToken = async (accessToken) => {
  try {
    const messaging = getMessaging();
    const fcmToken = await getToken(messaging);
    if (fcmToken) {
      await registerDevice(fcmToken, accessToken);
    }
  } catch (err) {}
};

export const registerDevice = async (token, accessToken) => {
  try {
    const payload = {
      token: token,
      device_type: Platform.OS,
    };

    await authApis(accessToken).post(endpoint.registerDevice, payload);
  } catch (err) {}
};

export const unregisterDevice = async () => {
  try {
    const messaging = getMessaging();
    await deleteToken(messaging);
  } catch (err) {}
};
