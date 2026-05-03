import { Dimensions, StyleSheet } from "react-native";

const phoneHeight = Dimensions.get("window").height;
const phoneWidth = Dimensions.get("window").width;

export default StyleSheet.create({
  background: {
    position: "relative",
    width: phoneWidth,
    height: phoneHeight * 0.5,
    experimental_backgroundImage:
      "linear-gradient(to bottom, #ffffffdc, #90e0ef )",
    borderRadius: 10,
  },
  banner: {
    position: "absolute",
    top: 0,
    width: phoneWidth,
    height: phoneHeight * 0.25,
    borderEndEndRadius: 10,
    objectFit: "cover",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  action: {
    position: "absolute",
    bottom: 0,
    width: phoneWidth,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  icon_group: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
