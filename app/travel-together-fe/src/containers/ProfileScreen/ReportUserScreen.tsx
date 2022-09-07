import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Alert,
  Image
} from "react-native";
import HeaderCommon, {
  headerStyles,
} from "../../components/HeaderCommon/HeaderCommon";

import { Feather } from "@expo/vector-icons";

import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from "react-native-simple-radio-button";
import Color from "../../utilites/Color";
import { newPostStyles } from "../PostScreen/NewPostScreen";
import { WINDOW_HEGIHT } from "../../utilites/Dimensions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import { BASE_URL } from "../../utilites";
import { BLOG_LIST, HOME_NAVIGATOR, LOGIN } from "../../utilites/routerName";
import ModalComponent from "../../components/Modal/ModalComponent";
import AppLoading from "../../components/AppLoader/AppLoading";

interface IProps {
  route: any;
}

const ReportUserScreen = (props: IProps) => {

  const { userId, type, blogId } = props.route.params;

  const navigation = useNavigation<any>();

  const [value, setValue] = useState<number>(1);

  const [loading, setLoading] = useState<boolean>(false);

  // set modal popup success report
  const [visible, setVisible] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");

  const reasons = [
    {
      id: 1,
      title: "Pretending to be someone",
      radio_object: { label: "param1", value: 0 },
    },
    {
      id: 2,
      title: "Fake account",
      radio_object: { label: "param1", value: 1 },
    },
    {
      id: 3,
      title: "Fake name",
      radio_object: { label: "param1", value: 2 },
    },
    {
      id: 4,
      title: "Posting inappropriate things",
      radio_object: { label: "param1", value: 3 },
    },
    {
      id: 5,
      title: "Something else",
      radio_object: { label: "param1", value: 3 },
    },
  ];

  const reasonsReportBlog = [
    {
      id: 1,
      title: "Spam",
      radio_object: { label: "param1", value: 0 },
    },
    {
      id: 2,
      title: "Unauthorized sales",
      radio_object: { label: "param1", value: 1 },
    },
    {
      id: 3,
      title: "Language from the hate",
      radio_object: { label: "param1", value: 2 },
    },
    {
      id: 4,
      title: "Posting inappropriate things",
      radio_object: { label: "param1", value: 3 },
    },
    {
      id: 5,
      title: "Something else",
      radio_object: { label: "param1", value: 3 },
    },
  ];

  const reportUser = async (id: string) => {
    try {
      if (description.trim() !== "") {
        // set animation loading
        setLoading(true);
        const response = await axios.post(`${BASE_URL}user/report`, {
          typeReport: "USER",
          reportId: id,
          description,
        });
        if (response.data) {
          setVisible(true);
        }
      } else {
        Alert.alert("Please enter description");
      }
      // set animation loading
      setLoading(false);
    } catch (error) {
      // set animation loading
      setLoading(false);
      console.log("error :", error);
    }
  };

  const reportBlog = async (id: string, type: string) => {
    try {
      let url_config = '';
      if (type == "BLOG") {
        url_config = 'user/blog/report-blog?blogId=';
      } else if (type == "ADS") {
        url_config = 'user/report-ads?adsId=';
      } else {
        url_config = 'user/report-qa?qaId=';
      }
      if (description.trim() !== "") {
        // set animation loading
        setLoading(true);
        const response = await axios.post(`${BASE_URL}${url_config}${id}`, {
          typeReport: type,
          reportId: id,
          description,
        });
        if (response.data.success) {
          setVisible(true);
        }
      } else {
        Alert.alert("Please enter description");
      }
      // set animation loading
      setLoading(false);
    } catch (error) {
      // set animation loading
      setLoading(false);
      console.log("error :", error);
    }
  };

  return (
    <SafeAreaView>
      {loading && <AppLoading />}
      {/* Modal success */}
      <ModalComponent visible={visible}>
        <View style={{ alignItems: 'center' }}>
          <View style={styles.header}>
            <TouchableOpacity>
              {/* <Image
                source={require('../../../assets/x.png')}
                style={{ height: 30, width: 30 }}
              /> */}
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={require('../../../assets/success.png')}
            style={{ height: 150, width: 150, marginVertical: 10 }}
          />
        </View>
        <Text style={{ marginVertical: 30, fontSize: 18, textAlign: 'center' }}>
          Thank you for reporting the rule violation, we will review it as soon as possible
        </Text>
        <TouchableOpacity
          onPress={() => type == "USER" ? navigation.navigate(HOME_NAVIGATOR) : navigation.navigate(BLOG_LIST)}>
          <Text style={styles.buttonModal}>{
            type == "USER" ? 'Go to home' : 'Go to explore'
          }</Text>
        </TouchableOpacity>
      </ModalComponent>
      <KeyboardAwareScrollView>
        <View style={headerStyles.header}>
          <TouchableOpacity
            style={{ width: 50, alignItems: "flex-start" }}
            onPress={() => navigation.goBack()}
          >
            <Feather name={"arrow-left"} size={24} />
          </TouchableOpacity>
          <Text style={headerStyles.headerText}>Report</Text>
          <TouchableOpacity
            style={{ width: 50, alignItems: "flex-end" }}
          ></TouchableOpacity>
        </View>
        <View style={{ padding: 10, marginBottom: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: "600" }}>
            Please select a problem
          </Text>
          <Text style={{ color: "#696B6E" }}>
            If someone is in immediate danger, get help before reporting to
            Travel Together. Don't wait.
          </Text>
        </View>
        <View>

          {
            type == "USER" ? reasons.map(({ id, title }: any, index) => (
              <UserItem
                key={index}
                id={id}
                title={title}
                onChange={(val: number) => {
                  setValue(val);
                }}
                active={value === id}
              ></UserItem>
            )) :
              reasonsReportBlog.map(({ id, title }: any, index) => (
                <UserItem
                  key={index}
                  id={id}
                  title={title}
                  onChange={(val: number) => {
                    setValue(val);
                  }}
                  active={value === id}
                ></UserItem>
              ))

          }
        </View>
        <View
          style={{
            padding: 10,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <TextInput
            multiline={true}
            numberOfLines={4}
            style={styles.description}
            placeholder="Decrible rule violation details"
            onSubmitEditing={Keyboard.dismiss}
            value={description}
            onChangeText={(value) => {
              setDescription(value);
            }}
          ></TextInput>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => {
              type == "USER" ? reportUser(userId) : reportBlog(blogId, type)
            }}
          >
            <Text style={styles.buttonText}>Report</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default ReportUserScreen;

interface UserItemProps {
  id: number;
  title: string;
  onChange: Function;
  active: boolean;
}

const UserItem = (props: UserItemProps) => {
  const { id, title, onChange, active } = props;
  return (
    <View style={{ paddingHorizontal: 10 }}>
      <TouchableOpacity
        onPress={() => {
          onChange(id);
        }}
        style={{
          paddingVertical: 6,
          flexDirection: "row",
          borderColor: "transparent",
          borderBottomColor: Color.icon_grey,
        }}
      >
        {active ? (
          <View style={styles.radioActive}>
            <View style={styles.radioActiveDot}></View>
          </View>
        ) : (
          <View style={styles.radio}></View>
        )}
        <Text style={{ fontSize: 16, paddingLeft: 10 }}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  radio: {
    width: 20,
    height: 20,
    borderColor: Color.icon_grey,
    borderWidth: 2,
    borderRadius: 100,
  },
  radioActive: {
    width: 20,
    height: 20,
    borderColor: Color.primary,
    borderWidth: 2,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  radioActiveDot: {
    width: 10,
    height: 10,
    backgroundColor: Color.primary,
    borderRadius: 100,
  },
  description: {
    borderColor: Color.grey,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    height: 200,
    marginBottom: 15,
  },
  buttonWrapper: {
    flex: 0.1,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  continueButton: {
    backgroundColor: Color.primary,
    borderRadius: 10,
    padding: 14,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    textAlign: "center",
    fontWeight: "500",
  },
  header: {
    width: '100%',
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  buttonModal: {
    fontSize: 18,
    color: 'white',
    marginTop: 20,
    borderRadius: 3,
    backgroundColor: '#0094FF',
    padding: 10,
    textAlign: 'center',
  },
});
