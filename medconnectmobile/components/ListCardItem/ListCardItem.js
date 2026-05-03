import { Image, Text, View } from "react-native";

const ListCardItem = ({ item, onPress }) => {
  return (
    <View>
      <Image
        source={{ uri: item?.avatar }}
        style={{ width: 100, height: 100 }}
      />
      <Text>
        {item?.first_name} {item?.last_name}
      </Text>
    </View>
  );
};

export default ListCardItem;
