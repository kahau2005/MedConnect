import { StyleSheet } from "react-native";

const SimpleCardStyle = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    width: 160,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F4F8",
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: 110,
    backgroundColor: "#F8F9FA",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
    lineHeight: 18,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0066FF",
  },
});

export default SimpleCardStyle;
