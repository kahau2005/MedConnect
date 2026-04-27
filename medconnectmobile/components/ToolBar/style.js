import { act } from "react";
import { StyleSheet } from "react-native";

const ToolBarStyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toolbar_actions_container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  toolbar_action: {
    width: 24,
    height: 24,
    objectFit: "contain",
  },
  action_more: {
    transform: [{ rotate: "90deg" }],
  },
});

export default ToolBarStyles;
