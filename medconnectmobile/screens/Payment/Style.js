import { Platform, StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  headerBar: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  hero: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 8,
  },
  statusCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  heroLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  heroAmount: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#92400E",
  },
  metaRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
    width: "100%",
  },
  metaCard: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 12,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
  },
  metaLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    marginBottom: 3,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },

  section: {
    backgroundColor: "#FFFFFF",
    marginBottom: 8,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeBlue: {
    backgroundColor: "#EFF6FF",
  },
  badgeGreen: {
    backgroundColor: "#F0FDF4",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  badgeTextBlue: {
    color: "#1D4ED8",
  },
  badgeTextGreen: {
    color: "#15803D",
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F3F4F6",
    gap: 10,
  },
  itemIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  iconBlue: {
    backgroundColor: "#EFF6FF",
  },
  iconGreen: {
    backgroundColor: "#F0FDF4",
  },
  itemInfo: {
    flex: 1,
    minWidth: 0,
  },
  itemName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  itemQty: {
    fontSize: 12,
    color: "#6B7280",
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    flexShrink: 0,
  },

  summarySection: {
    backgroundColor: "#FFFFFF",
    marginBottom: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sumRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  sumLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  sumVal: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  divider: {
    height: 0.5,
    backgroundColor: "#E5E7EB",
    marginVertical: 8,
  },
  sumTotalLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  sumTotalVal: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 28 : 20,
    paddingTop: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 0.5,
    borderTopColor: "#E5E7EB",
  },
  zaloPayButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0068FF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  zaloLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  zaloLogo: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  zaloLogoText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0068FF",
  },
  zaloText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  zaloAmount: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
