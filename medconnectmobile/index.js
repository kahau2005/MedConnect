import { registerRootComponent } from "expo";

import App from "./App";
import {
  getMessaging,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";

setBackgroundMessageHandler(getMessaging(), async (remoteMessage) => {
  console.log("Background message: ", remoteMessage);
});
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
