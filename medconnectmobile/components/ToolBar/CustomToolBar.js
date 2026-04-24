import React from "react";
import { View, Text, Animated, StyleSheet, Dimensions } from "react-native";
import { Button, IconButton, Searchbar } from "react-native-paper";

const { width } = Dimensions.get("window");

const CustomToolBar = ({
  title = "MedConnect",
  scrollY = new Animated.Value(0),
  headerScrollDistance = 140,
  backAction,
}) => {
  const titleScale = scrollY.interpolate({
    inputRange: [0, headerScrollDistance],
    outputRange: [1.3, 1],
    extrapolate: "clamp",
  });

  const titleTranslateX = scrollY.interpolate({
    inputRange: [0, headerScrollDistance],
    outputRange: [-(width / 2) + 120, 0],
    extrapolate: "clamp",
  });

  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, headerScrollDistance],
    outputRange: [0, -5],
    extrapolate: "clamp",
  });
  const searchBarOpacity = scrollY.interpolate({
    inputRange: [0, headerScrollDistance / 2],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const iconOpacity = scrollY.interpolate({
    inputRange: [headerScrollDistance / 2, headerScrollDistance],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <Animated.View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          top: 50,
          left: 20,
          right: 20,
          opacity: searchBarOpacity,
          flexDirection: "row",
          gap: 30,
        }}
      >
        {backAction && (
          <IconButton
            style={{ backgroundColor: "white", width: 40, height: 40 }}
            icon={"arrow-left"}
            onPress={backAction}
          ></IconButton>
        )}
        <Searchbar
          style={{ flex: 1, backgroundColor: "white" }}
          placeholder="Tìm kiếm bác sĩ..."
        />
      </Animated.View>

      <Animated.View
        style={{
          position: "absolute",
          bottom: 0,
          right: 15,
          opacity: iconOpacity,
        }}
      >
        <IconButton
          icon="magnify"
          iconColor="white"
          size={28}
          onPress={() => console.log("Mở màn hình tìm kiếm riêng")}
        />
      </Animated.View>

      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 10,
          alignItems: "center",
          transform: [
            { translateX: titleTranslateX },
            { translateY: titleTranslateY },
            { scale: titleScale },
          ],
        }}
      >
        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
          {title}
        </Text>
      </Animated.View>
    </View>
  );
};

export default CustomToolBar;
