import { StyleSheet } from "react-native";

const SimpleCardStyle = StyleSheet.create({
  container: {
    backgroundColor: "#cfcfcf57",
    width: 200,
    padding: 15,
    borderRadius: 10,
    justifyContent: "space-between",
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
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#3E64FF",
    textAlign: "right",
    marginTop: 5,
  },
});

export default SimpleCardStyle;
