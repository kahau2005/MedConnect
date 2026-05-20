import { Text, View } from "react-native";
import { TextInput } from "react-native-paper";
import InputStyle from "./Style";

const InputText = ({ label, placeholder, inputType, CustomInput, style }) => {
  return (
    <View style={[InputStyle.container, style]}>
      <Text style={InputStyle.label}>{label}</Text>
      {CustomInput ? (
        CustomInput
      ) : (
        <TextInput
          style={[InputStyle.input, style]}
          placeholder={placeholder}
          secureTextEntry={inputType === "password"}
          keyboardType={inputType === "number" ? "numeric" : "default"}
          multiline={inputType === "multiline"}
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          cursorColor="black"
        />
      )}
    </View>
  );
};

export default InputText;
