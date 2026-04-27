import { ScrollView, TouchableOpacity, View } from "react-native";
import { Searchbar } from "react-native-paper";
import SimpleCardView from "../SimpleCardView/SimpleCardView";
import ListItemStyle from "./Style";

const ListItemView = ({ searchTitle, items, clickProcess, setItemId }) => {
  return (
    <View style={ListItemStyle.container}>
      {searchTitle && <Searchbar placeholder={searchTitle} />}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={ListItemStyle.item_container}
      >
        {items.map((item, index) => (
          <SimpleCardView
            key={item.id || index}
            style={{ width: "48%" }}
            title={item.name}
            description={item.description}
            image={
              item.image === undefined || item.image === null
                ? require("../../assets/imgs/banner_doctor.png")
                : { uri: item.image }
            }
            clickProcess={() => {
              clickProcess(item);
              console.log("Clicked item ID:", item.id);
            }}
            price={item.price}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default ListItemView;
