import { useCallback, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "react-native-paper";
import { DatePickerInput, TimePickerModal } from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppointmentStyle from "./Style";
import InputText from "../../components/InputText/InputText";
import ButtonStyle from "../../components/Button/Style";
import DropdownComponent from "../../components/Dropdown/Dropdown";
import Apis, { endpoint } from "../../configs/Apis";
import {
  DropdownSpecialtyItemMapper,
  DropdownDoctorItemMapper,
} from "../../helpers/Mapper";

const Appointment = () => {
  const [inputDate, setInputDate] = useState(undefined);
  const [showTime, setShowTime] = useState(false);
  const [inputTime, setInputTime] = useState(undefined);
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [specialtyValue, setSpecialtyValue] = useState("");
  const [doctorValue, setDoctorValue] = useState("");

  const onDismiss = useCallback(() => {
    setShowTime(false);
  }, [setShowTime]);

  const onConfirm = useCallback(
    ({ hours, minutes }) => {
      setShowTime(false);
      setInputTime({ hours, minutes });
      console.log({ hours, minutes });
    },
    [setShowTime],
  );
  const fetchSpecialties = async () => {
    let res = await Apis.get(endpoint["specialties"]);
    setSpecialties(DropdownSpecialtyItemMapper(res.data));
  };

  const fetchDoctors = async (specialtyId) => {
    try {
      let res = await Apis.get(endpoint.specialties + `${specialtyId}/doctors`);
      setDoctors(DropdownDoctorItemMapper(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (specialtyValue) {
      fetchDoctors(specialtyValue);
    }
  }, [specialtyValue]);

  useEffect(() => {
    fetchSpecialties();
  }, []);

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={20}
    >
      <SafeAreaProvider style={AppointmentStyle.container}>
        <View>
          <Text style={AppointmentStyle.label}>Chọn ngày và giờ hẹn</Text>
          <InputText
            label="Chọn ngày hẹn"
            CustomInput={
              <DatePickerInput
                locale="vi"
                value={inputDate}
                onChange={(d) => setInputDate(d)}
                withDateFormatInLabel={false}
                style={{ backgroundColor: "white" }}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                cursorColor="black"
              />
            }
          />
          <InputText
            label="Chọn giờ hẹn"
            CustomInput={
              <>
                <View>
                  {inputTime && (
                    <Text
                      style={{
                        fontSize: 20,
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {`${inputTime.hours}:${inputTime.minutes}`}
                    </Text>
                  )}
                </View>
                <Button
                  textColor="white"
                  style={ButtonStyle.container}
                  onPress={() => setShowTime(true)}
                >
                  Chọn giờ
                </Button>
                <TimePickerModal
                  visible={showTime}
                  onDismiss={onDismiss}
                  onConfirm={onConfirm}
                  hours={12}
                  minutes={0}
                />
              </>
            }
          />
        </View>

        <View>
          <Text style={AppointmentStyle.label}>Chuyên khoa & Bác sĩ</Text>
          <InputText
            label={"Chọn chuyên khoa"}
            CustomInput={
              <DropdownComponent
                data={specialties}
                label="Chọn chuyên khoa"
                value={specialtyValue}
                setValue={setSpecialtyValue}
              />
            }
          />
          <InputText
            label={"Chọn bác sĩ"}
            CustomInput={
              <DropdownComponent
                data={doctors}
                label="Chọn bác sĩ"
                value={doctorValue}
                setValue={setDoctorValue}
              />
            }
          />
        </View>
        <View style={{ flex: 1 }}>
          <InputText
            label={"Triệu chứng"}
            inputType={"multiline"}
            style={{ flex: 1 }}
          />
        </View>

        <Button
          style={[ButtonStyle.container, { marginBottom: 15 }]}
          mode="contained"
          onPress={() => console.log("Đặt hẹn")}
        >
          Đặt hẹn
        </Button>
      </SafeAreaProvider>
    </KeyboardAwareScrollView>
  );
};

export default Appointment;
