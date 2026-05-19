import { StyleSheet } from "react-native";

export default StyleSheet.create({
    loadingContainer: { flex: 1, backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center' },
    loadingPulse: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#374151', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
    loadingText: { fontSize: 16, color: '#D1D5DB', fontWeight: '500' },
    cancelBtn: { position: 'absolute', bottom: 60, width: 60, height: 60, borderRadius: 30, backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'center' },
    callContainer: { flex: 1, backgroundColor: '#000000' },
})