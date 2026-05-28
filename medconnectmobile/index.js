import { registerRootComponent } from "expo";

import App from "./App";
import {
  getMessaging,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";

setBackgroundMessageHandler(getMessaging(), async (remoteMessage) => {
  console.log("Background message: ", remoteMessage);
});
registerRootComponent(App);
