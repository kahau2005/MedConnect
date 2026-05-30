import { ScrollView, TouchableOpacity, View } from "react-native";
import { Searchbar } from "react-native-paper";
import SimpleCardView from "../SimpleCardView/SimpleCardView";
import ListItemStyle from "./Style";

const ListItemView = ({ searchTitle, items, clickProcess, setItemId }) => {
  const formatImageUrl = (url) => {
    if (!url) return null;
    if (!url.match(/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i)) {
      return `${url}.png`;
    }
    return url;
  };
  return (
    <View style={ListItemStyle.container}>
      {searchTitle && <Searchbar placeholder={searchTitle} />}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={ListItemStyle.item_container}
      >
        {items.map((item, index) => {
          const validImageUrl = formatImageUrl(item.image);

          return (
            <SimpleCardView
              key={item.id || index}
              style={{ width: "48%" }}
              title={item.name}
              description={item.description}
              image={
                !validImageUrl
                  ? require("../../assets/imgs/banner_doctor.png")
                  : { uri: validImageUrl }
              }
              clickProcess={() => {
                clickProcess(item);
              }}
              price={item.price}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default ListItemView;
