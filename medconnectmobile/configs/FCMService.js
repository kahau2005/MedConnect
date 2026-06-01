import {
  getMessaging,
  requestPermission,
  getToken,
  deleteToken,
} from "@react-native-firebase/messaging";
import { Platform } from "react-native";
import { authApis, endpoint } from "./Apis";

export const requestUserPermission = async (accessToken) => {
  try {
    const messaging = getMessaging();
    const authStatus = await requestPermission(messaging);
    const enabled = authStatus === 1 || authStatus === 2;

    if (enabled) {
      console.log(authStatus);
      await getFcmToken(accessToken);
    } else {
      console.log("Quyền thông báo: Bị từ chối.");
    }
  } catch (err) {
    console.error("Lỗi khi yêu cầu quyền thông báo: ", err);
  }
};

export const getFcmToken = async (accessToken) => {
  try {
    const messaging = getMessaging();
    const fcmToken = await getToken(messaging);
    if (fcmToken) {
      console.log("FCM Token: ", fcmToken);
      await registerDevice(fcmToken, accessToken);
    } else {
      console.log("Không nhận được FCM token");
    }
  } catch (error) {
    console.error("Lỗi khi lấy FCM token: ", error);
  }
};

export const registerDevice = async (token, accessToken) => {
  try {
    const payload = {
      token: token,
      device_type: Platform.OS,
    };

    await authApis(accessToken).post(endpoint.registerDevice, payload);
  } catch (error) {
    console.error(
      "Lỗi khi đăng ký thiết bị: ",
      error?.response?.data || error.message,
    );
  }
};

export const unregisterDevice = async () => {
  try {
    const messaging = getMessaging();
    await deleteToken(messaging);
    console.log("Hủy đăng ký thiết bị thành công khi logout");
  } catch (error) {
    console.error(
      "Lỗi khi hủy đăng ký thiết bị: ",
      error?.response?.data || error.message,
    );
  }
};
