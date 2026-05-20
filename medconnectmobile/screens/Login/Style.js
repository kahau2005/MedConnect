import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  keyboardView: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  brandSection: {
    marginBottom: 40,
  },
  logoBg: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#F0F5FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 22,
  },
  formSection: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    height: "100%",
  },
  eyeBtn: {
    padding: 8,
    marginRight: -8,
  },
  forgotPassBtn: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPassText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0066FF",
  },
  loginBtn: {
    backgroundColor: "#0066FF",
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0066FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginBtnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    width: "100%",
    textAlign: "center",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#6B7280",
  },
  socialSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  socialBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 52,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    marginHorizontal: 6,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  socialBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  registerText: {
    fontSize: 15,
    color: "#6B7280",
  },
  registerLink: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0066FF",
  },
});
