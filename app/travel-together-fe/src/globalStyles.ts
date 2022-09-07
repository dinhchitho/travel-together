import { StyleSheet } from "react-native";
import Color from "./utilites/Color";

export const globalStyles = StyleSheet.create({
  primaryButton: {
    backgroundColor: Color.primary,
    borderRadius: 10,
    padding: 15,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  dateWrapper: {
    backgroundColor: "#FFFFFF",
    paddingBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderBottomColor: Color.grey,
    borderColor: "transparent",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  bgWhite: {
    backgroundColor: Color.white,
  },
  w100: {
    width: 100,
  },
  textCenter: {
    textAlign: "center",
  },
  fw500: {
    fontWeight: "500",
  },
  fz12: {
    fontSize: 12,
  },

  textBlue: {
    color: Color.primary,
  },
  py15: {
    paddingVertical: 15,
  },
  px15: {
    paddingHorizontal: 15,
  },
});
