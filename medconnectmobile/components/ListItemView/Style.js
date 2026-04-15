import { StyleSheet } from "react-native";

const ListItemStyle = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 15,
    gap: 15,
    marginVertical: 10,
  },
  item_container: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
});

export default ListItemStyle;
