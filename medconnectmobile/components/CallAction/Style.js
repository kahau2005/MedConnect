import { StyleSheet } from "react-native";

const CallActionStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#9e9e9e1e",
    borderRadius: 9,
    margin: 16,
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#666666b2",
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    width: 40,
    height: 40,
    borderRadius: 10,
  },
});

export default CallActionStyles;
