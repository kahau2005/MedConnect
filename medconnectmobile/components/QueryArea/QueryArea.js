import { FlatList, View } from "react-native";
import { Searchbar } from "react-native-paper";
import Style from "./Style";
import ListItem from "../ListItem/ListItem";

const QueryArea = ({ showSearch, searchPlaceholder, value, onChangeText }) => {
  return (
    <View>
      {showSearch && (
        <Searchbar
          style={Style.search}
          placeholder={searchPlaceholder}
          value={value}
          onChangeText={onChangeText}
        />
      )}
    </View>
  );
};

export default QueryArea;
