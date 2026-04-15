import { StyleSheet } from "react-native";

const HorizontalItemsStyle = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 15,
    gap: 15,
    marginVertical: 10,
  },
  item_container: {
    flexDirection: "row",
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default HorizontalItemsStyle;
