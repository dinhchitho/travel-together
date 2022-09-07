import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import HeaderCommon from "../../components/HeaderCommon/HeaderCommon";
import { EDIT_PROFILE } from "../../utilites/routerName";
import { AntDesign } from "@expo/vector-icons";
import Color from "../../utilites/Color";
import { CountryItem } from "../../components/post/SelectCountry";
import { COUNTRIES } from "../../api/Const";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../../globalStyles";
import { log } from "react-native-reanimated";

interface IProps {}

const SearchCountryScreen = (props: IProps) => {
  const navigation = useNavigation<any>();

  const [keyword, setKeyword] = useState<string>("");
  const [keywordFocus, setKeyworFocus] = useState<boolean>(false);
  const [countries, setCountries] = useState<any>(COUNTRIES);

  const keywordRef = useRef<any>();

  const handleOnChangeKeyword = (e: any) => {
    setKeyword(e);
    const countriesFilter = COUNTRIES.filter((item) =>
      item.name.common.toLowerCase().includes(e.toLowerCase())
    );
    setCountries(countriesFilter);
  };

  // useEffect(() => {}, []);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <HeaderCommon
          leftIcon={"arrow-left"}
          leftNavigation={EDIT_PROFILE}
          title="Nationality"
        ></HeaderCommon>
        <View
          style={{
            borderColor: "transparent",
            borderWidth: 1,
            borderBottomColor: "#ECEDEE",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#ECEDEE",
              padding: 8,
              borderRadius: 8,
            }}
          >
            <AntDesign
              name="search1"
              size={20}
              color="black"
              style={{ marginRight: 4 }}
            />
            <TextInput
              placeholder="Search"
              ref={keywordRef}
              value={keyword}
              onChangeText={(keyword) => {
                handleOnChangeKeyword(keyword);
              }}
              onPressIn={() => {
                setKeyworFocus(true);
              }}
              style={{ width: "78%" }}
            ></TextInput>
          </View>
          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              setKeyworFocus(false);
              handleOnChangeKeyword("");
            }}
          >
            <Text style={keywordFocus ? globalStyles.textBlue : null}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={{ paddingHorizontal: 10 }}>
          {countries.map((item: any, index: number) => (
            <CountryItem
              key={index}
              name={item.name.common}
              flat_url={item.flags.png}
              keyword={keyword}
              onPress={() => {
                navigation.navigate(EDIT_PROFILE, {
                  keyword: item.name.common,
                });
                // onChange(item.name.common);
                // handleChooseCountry(item.name.common);
              }}
            ></CountryItem>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SearchCountryScreen;

const styles = StyleSheet.create({
  container: {},
});
