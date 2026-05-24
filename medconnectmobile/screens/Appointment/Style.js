import { StyleSheet } from "react-native";

const AppointmentStyle = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 10,
    gap: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(17, 24, 39, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#F4F6F9",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  modalSubTitle: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  modalScroll: {
    padding: 16,
    paddingBottom: 40,
  },
  actionBtnPrimary: {
    backgroundColor: "#0066FF",
    borderRadius: 12,
  },
  actionBtnPrimaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AppointmentStyle;
