import { FlatList, View } from "react-native";
import { Searchbar } from "react-native-paper";
import Style from "./Style";
import ListItem from "../ListItem/ListItem";

const QueryArea = ({ showSearch, searchPlaceholder }) => {
  return (
    <View>
      {showSearch && (
        <Searchbar style={Style.search} placeholder={searchPlaceholder} />
      )}
    </View>
  );
};

export default QueryArea;
