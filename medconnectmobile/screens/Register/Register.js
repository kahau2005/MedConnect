import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import Style from "./Style";
import Apis, { endpoint } from "../../configs/Apis";

const Register = () => {
  const nav = useNavigation();
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [avatar, setAvatar] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChooseAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Lỗi", "Cần cấp quyền truy cập thư viện ảnh để chọn Avatar!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0]);
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);

      if (avatar) {
        const localUri = avatar.uri;
        const filename = localUri.split("/").pop();

        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append("avatar", {
          uri: localUri,
          name: filename,
          type: type,
        });
      }

      const res = await Apis.post(endpoint.register, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201 || res.status === 200) {
        Alert.alert("Thành công", "Đăng ký tài khoản thành công!", [
          { text: "OK", onPress: () => nav.navigate("Login") },
        ]);
      }
    } catch (error) {
      Alert.alert("Lỗi", error?.response?.data?.err || "Không xác định!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={Style.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 90}
          style={Style.keyboardView}
        >
          <ScrollView
            contentContainerStyle={Style.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={Style.brandSection}>
              <Text style={Style.title}>Tạo tài khoản mới</Text>
              <Text style={Style.subtitle}>
                Vui lòng điền đầy đủ thông tin bên dưới để đăng ký.
              </Text>
            </View>

            <View style={Style.formSection}>
              <TouchableOpacity
                style={Style.avatarPickerContainer}
                activeOpacity={0.8}
                onPress={handleChooseAvatar}
              >
                {avatar ? (
                  <Image
                    source={{ uri: avatar.uri }}
                    style={Style.avatarImage}
                  />
                ) : (
                  <>
                    <Feather name="camera" size={24} color="#0066FF" />
                    <Text style={Style.avatarPlaceholderText}>Thêm ảnh</Text>
                  </>
                )}
              </TouchableOpacity>

              <View style={Style.rowInputs}>
                <View
                  style={[Style.halfInputGroup, Style.mr12, Style.inputGroup]}
                >
                  <Text style={Style.inputLabel}>Họ (Last Name)</Text>
                  <View style={Style.inputContainer}>
                    <TextInput
                      style={Style.input}
                      placeholder="Nguyễn Văn"
                      placeholderTextColor="#9CA3AF"
                      value={lastName}
                      onChangeText={setLastName}
                    />
                  </View>
                </View>

                <View style={[Style.halfInputGroup, Style.inputGroup]}>
                  <Text style={Style.inputLabel}>Tên (First Name)</Text>
                  <View style={Style.inputContainer}>
                    <TextInput
                      style={Style.input}
                      placeholder="A"
                      placeholderTextColor="#9CA3AF"
                      value={firstName}
                      onChangeText={setFirstName}
                    />
                  </View>
                </View>
              </View>

              <View style={Style.inputGroup}>
                <Text style={Style.inputLabel}>Tên đăng nhập (Username)</Text>
                <View style={Style.inputContainer}>
                  <Feather
                    name="user"
                    size={20}
                    color="#9CA3AF"
                    style={Style.inputIcon}
                  />
                  <TextInput
                    style={Style.input}
                    placeholder="Viết liền không dấu"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="none"
                    value={username}
                    onChangeText={setUsername}
                  />
                </View>
              </View>

              <View style={Style.inputGroup}>
                <Text style={Style.inputLabel}>Email</Text>
                <View style={Style.inputContainer}>
                  <Feather
                    name="mail"
                    size={20}
                    color="#9CA3AF"
                    style={Style.inputIcon}
                  />
                  <TextInput
                    style={Style.input}
                    placeholder="nguyenvana@gmail.com"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              <View style={Style.inputGroup}>
                <Text style={Style.inputLabel}>Số điện thoại</Text>
                <View style={Style.inputContainer}>
                  <Feather
                    name="phone"
                    size={20}
                    color="#9CA3AF"
                    style={Style.inputIcon}
                  />
                  <TextInput
                    style={Style.input}
                    placeholder="0123456789"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
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
                    placeholder="Tạo mật khẩu"
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

              <View style={Style.inputGroup}>
                <Text style={Style.inputLabel}>Xác nhận mật khẩu</Text>
                <View style={Style.inputContainer}>
                  <Feather
                    name="check-circle"
                    size={20}
                    color="#9CA3AF"
                    style={Style.inputIcon}
                  />
                  <TextInput
                    style={Style.input}
                    placeholder="Nhập lại mật khẩu"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity
                    style={Style.eyeBtn}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Feather
                      name={showConfirmPassword ? "eye" : "eye-off"}
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={[Style.loginBtn, Style.registerSubmitBtn]}
                activeOpacity={0.8}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={Style.loginBtnText}>Đăng ký tài khoản</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={Style.registerRow}>
              <Text style={Style.registerText}>Đã có tài khoản? </Text>
              <TouchableOpacity onPress={() => nav.navigate("Login")}>
                <Text style={Style.registerLink}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Register;
