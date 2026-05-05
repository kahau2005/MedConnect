import { StyleSheet } from "react-native";

export default StyleSheet.create({
  cardContainer: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderColor: "#F0F0F0",
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 11,
    borderTopRightRadius: 11,
  },
  textContainer: {
    padding: 12,
    minHeight: 64,
  },
  nameText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
    lineHeight: 20,
  },
});
