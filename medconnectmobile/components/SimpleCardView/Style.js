import { StyleSheet } from "react-native";

const SimpleCardStyle = StyleSheet.create({
  container: {
    backgroundColor: "#cfcfcf57",
    width: 200,
    padding: 15,
    borderRadius: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 10,
  },
  description: {
    fontSize: 12,
    color: "#666",
  },
  image: {
    width: "100%",
    height: 100,
    objectFit: "contain",
  },
});

export default SimpleCardStyle;
