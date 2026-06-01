import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, ActivityIndicator, Text, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallContent,
} from "@stream-io/video-react-native-sdk";

import { UserContext } from "../../contexts/UserContext";
import Apis, { authApis, endpoint, STREAM_API } from "../../configs/Apis";

export default function CallStream() {
  const nav = useNavigation();
  const route = useRoute();

  const { callId, initialCameraOn = false } = route.params || {};

  const [user] = useContext(UserContext);
  const [videoClient, setVideoClient] = useState(null);
  const [call, setCall] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let client;
    let currentCall;

    const initVideoCall = async () => {
      try {
        const res = await authApis(user.access_token).get(endpoint.streamToken);
        const { stream_token, user_id, full_name } = res.data;

        const streamUser = { id: String(user_id), name: full_name };
        client = new StreamVideoClient({
          apiKey: STREAM_API,
          user: streamUser,
          token: stream_token,
        });

        currentCall = client.call("default", callId);

        await currentCall.join({ create: true });

        if (initialCameraOn) {
          await currentCall.camera.enable();
        } else {
          await currentCall.camera.disable();
        }

        if (isMounted) {
          setVideoClient(client);
          setCall(currentCall);
        }
      } catch (error) {
        const errData = error?.response?.data?.err;
        const errorMessage = Array.isArray(errData)
          ? errData[0]
          : errData || "Không xác định!";
        Alert.alert("Lỗi", errorMessage);
        nav.goBack();
      }
    };

    if (user && callId) initVideoCall();

    return () => {
      isMounted = false;
      if (currentCall) currentCall.leave().catch(console.log);
      if (client) client.disconnectUser().catch(console.log);
    };
  }, [user, callId]);

  if (!videoClient || !call) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066FF" />
        <Text style={styles.loadingText}>Đang thiết lập kết nối...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StreamVideo client={videoClient}>
        <StreamCall call={call}>
          <View style={styles.callWrapper}>
            <CallContent
              onHangupCallHandler={() => {
                call.leave();
                nav.goBack();
              }}
            />
          </View>
        </StreamCall>
      </StreamVideo>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#272A30" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#272A30",
  },
  loadingText: { marginTop: 12, color: "#FFFFFF", fontSize: 16 },
  callWrapper: { flex: 1 },
});
