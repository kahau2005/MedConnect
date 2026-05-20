import { StyleSheet } from "react-native";

export default StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(17, 24, 39, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  contentBox: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 24,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  messageText: {
    marginTop: 16,
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },
});
