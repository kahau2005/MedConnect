import React, { useContext, useReducer, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Style from "./Style";
import Apis, { authApis, endpoint } from "../../configs/Apis";
import LoadingModal from "../../components/LoadingModel/LoadingModel";
import { UserContext } from "../../contexts/UserContext";
import { requestUserPermission } from "../../configs/FCMService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const nav = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [user, dispatch] = useContext(UserContext);

  const getCurrentUserInfo = async (token) => {
    const res = await authApis(token).get(endpoint.current_user);
    return res.data;
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await Apis.post(endpoint.login, {
        username: username,
        password: password,
        grant_type: "password",
      });
      console.log(res.data);
      const currentUser = await getCurrentUserInfo(res.data.access_token);
      const userData = {
        ...currentUser,
        access_token: res.data.access_token,
      };
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      dispatch({
        type: "LOGIN",
        payload: userData,
      });
      nav.navigate("HomeScreen");
      requestUserPermission(res.data.access_token);
    } catch (err) {
      Alert.alert(
        "Đăng nhập thất bại",
        "Tên đăng nhập hoặc mật khẩu không chính xác!",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={Style.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={Style.keyboardView}
        >
          <View style={Style.content}>
            <View style={Style.brandSection}>
              <View style={Style.logoBg}>
                <Feather name="activity" size={32} color="#0066FF" />
              </View>
              <Text style={Style.title}>Chào mừng trở lại!</Text>
              <Text style={Style.subtitle}>
                Đăng nhập để tiếp tục quản lý hồ sơ và đặt lịch khám tại
                MedConnect.
              </Text>
            </View>

            <View style={Style.formSection}>
              <View style={Style.inputGroup}>
                <Text style={Style.inputLabel}>Tên đăng nhập / Email</Text>
                <View style={Style.inputContainer}>
                  <Feather
                    name="mail"
                    size={20}
                    color="#9CA3AF"
                    style={Style.inputIcon}
                  />
                  <TextInput
                    style={Style.input}
                    placeholder="Nhập tên đăng nhập của bạn"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="none"
                    value={username}
                    onChangeText={setUsername}
                  />
                </View>
              </View>

              <View style={Style.inputGroup}>
                <Text style={Style.inputLabel}>Mật khẩu</Text>
                <View style={Style.inputContainer}>
                  <Feather
                    name="lock"
                    size={20}
                    color="#9CA3AF"
                    style={Style.inputIcon}
                  />
                  <TextInput
                    style={Style.input}
                    placeholder="Nhập mật khẩu"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity
                    style={Style.eyeBtn}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Feather
                      name={showPassword ? "eye" : "eye-off"}
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={Style.loginBtn}
                activeOpacity={0.8}
                onPress={handleLogin}
              >
                <Text style={Style.loginBtnText}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>

            <View style={Style.registerRow}>
              <Text style={Style.registerText}>Chưa có tài khoản? </Text>
              <TouchableOpacity onPress={() => nav.navigate("Register")}>
                <Text style={Style.registerLink}>Đăng ký ngay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      {loading && <LoadingModal />}
    </SafeAreaView>
  );
};

export default Login;
