import { StyleSheet } from "react-native";

const BannerCardStyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#3E64FF",
    margin: 20,
    marginHorizontal: 30,
    borderRadius: 20,
    height: 400,
  },
  title_container: {
    padding: 20,
  },
  banner_title: {
    width: "100%",
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
  banner_subtitle: {
    color: "white",
    fontSize: 18,
  },
  banner_image_container: {
    display: "flex",
    alignItems: "center",
  },
  banner_image: {
    height: 200,
    objectFit: "contain",
  },
});

export default BannerCardStyles;
