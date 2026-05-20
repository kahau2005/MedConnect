import { Button } from "react-native-paper";
import ButtonStyle from "./Style";

const Button = ({ title, onPress, style }) => {
  return (
    <Button onPress={onPress} style={[style, ButtonStyle.container]}>
      {title}
    </Button>
  );
};

export default Button;
