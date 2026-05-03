import { StyleSheet, Text } from "react-native";
import { Image, View } from "react-native";
import { List } from "react-native-paper";

const ListItem = ({ item }) => {
  return (
    <List.Item
      style={listStyle.item}
      title={item.name}
      description={item.description}
      left={() => (
        <Image
          source={{ uri: item.image }}
          style={{ width: 50, height: 50, borderRadius: 25 }}
        />
      )}
    />
  );
};

export default ListItem;

const listStyle = StyleSheet.create({
  item: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
  },
});
