import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#F3F4F6' },
  backBtn: { padding: 4 },
  headerInfo: { flex: 1, marginLeft: 12 },
  doctorName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  statusText: { fontSize: 12, color: '#10B981', marginTop: 2 },
  actionGroup: { flexDirection: 'row' },
  actionBtn: { marginLeft: 16, padding: 8, backgroundColor: '#F0F5FF', borderRadius: 20 },
  chatWrapper: { flex: 1 },
})