import React, { useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import ColapsingToolBarStyle from "./Style";

const CollapsingToolBar = ({
  children,
  headerComponent,
  headerMaxHeight = 220,
  headerMinHeight = 90,
  backgroundColor = "#03A9F4",
}) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerScrollDistance = headerMaxHeight - headerMinHeight;

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, headerScrollDistance],
    outputRange: [0, -headerScrollDistance],
    extrapolate: "clamp",
  });

  return (
    <View style={ColapsingToolBarStyle.container}>
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        showsVerticalScrollIndicator={false}
        snapToOffsets={[0, headerScrollDistance]}
        snapToAlignment="start"
        decelerationRate="fast"
      >
        <View style={{ height: headerMaxHeight }} />
        {children}
      </Animated.ScrollView>

      <Animated.View
        style={[
          ColapsingToolBarStyle.header,
          {
            height: headerMaxHeight,
            backgroundColor: backgroundColor,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        {headerComponent &&
          React.cloneElement(headerComponent, {
            scrollY: scrollY,
            headerScrollDistance: headerScrollDistance,
          })}
      </Animated.View>
    </View>
  );
};

export default CollapsingToolBar;
