import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, ActivityIndicator, Text, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- STREAM VIDEO IMPORTS ---
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallContent,
} from "@stream-io/video-react-native-sdk";

import { UserContext } from "../../contexts/UserContext";
import { authApis, endpoint } from "../../configs/Apis";

const STREAM_API_KEY = "6eqc726krv44"; // Trùng API Key với Chat

export default function CallStream() {
  const nav = useNavigation();
  const route = useRoute();

  // Nhận callId và trạng thái camera ban đầu từ ChatStream truyền sang
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
        // 1. Lấy token (Dùng lại API lấy token của Chat)
        const res = await authApis(user.access_token).get(endpoint.streamToken);
        const { stream_token, user_id, full_name } = res.data;

        // 2. Khởi tạo Client Video
        const streamUser = { id: String(user_id), name: full_name };
        client = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user: streamUser,
          token: stream_token,
        });

        // 3. Khởi tạo/Tham gia phòng gọi (Loại 'default' hỗ trợ cả thoại và hình)
        currentCall = client.call("default", callId);

        // Join vào call
        await currentCall.join({ create: true });

        // 4. Xử lý Trạng thái Camera ban đầu (Gọi thoại hay Gọi Video)
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
        console.error("Lỗi khởi tạo cuộc gọi:", error);
        Alert.alert("Lỗi", "Không thể kết nối cuộc gọi lúc này.");
        nav.goBack();
      }
    };

    if (user && callId) initVideoCall();

    return () => {
      isMounted = false;
      // Cleanup: Rời cuộc gọi và ngắt kết nối khi thoát màn hình
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
            {/* CallContent dựng sẵn giao diện giống 100% Messenger */}
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
  container: { flex: 1, backgroundColor: "#272A30" }, // Màu nền tối cho giao diện Call
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#272A30",
  },
  loadingText: { marginTop: 12, color: "#FFFFFF", fontSize: 16 },
  callWrapper: { flex: 1 },
});
