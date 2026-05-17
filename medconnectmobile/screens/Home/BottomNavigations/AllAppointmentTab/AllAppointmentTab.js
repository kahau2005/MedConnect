import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Platform
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Style from "./Style";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const upcomingAppointments = [
  { 
    id: 1, 
    doctor: 'BS. Phillip Franci', 
    specialty: 'Khoa Tim mạch', 
    date: '16 Tháng 5, 2026', 
    time: '10:00 AM',
    avatar: null
  },
  { 
    id: 2, 
    doctor: 'BS. Emily Johnson', 
    specialty: 'Khoa Nhi', 
    date: '18 Tháng 5, 2026', 
    time: '14:30 PM',
    avatar: null
  }
];

const pastAppointments = [
  { 
    id: 3, 
    doctor: 'BS. Jane Smith', 
    specialty: 'Khoa Da liễu', 
    date: '10 Tháng 5, 2026', 
    time: '09:00 AM', 
    status: 'Hoàn thành',
    avatar: null
  },
  { 
    id: 4, 
    doctor: 'BS. Terry Bergson', 
    specialty: 'Khoa Thần kinh', 
    date: '02 Tháng 5, 2026', 
    time: '15:00 PM', 
    status: 'Đã hủy',
    avatar: null
  },
];



const AllAppointmentTab = () => {
  const nav = useNavigation()
  return (
    <SafeAreaView style={Style.container}>
      <View style={Style.header}>
        <Text style={Style.headerTitle}>Lịch hẹn & Tư vấn</Text>
        <TouchableOpacity style={Style.searchBtn}>
          <Feather name="search" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={Style.scrollContent}
      >
        <View style={Style.section}>
          <Text style={Style.sectionTitle}>Sắp tới</Text>
          
          {upcomingAppointments.map((item) => (
            <View key={item.id} style={Style.upcomingCard}>
              <View style={Style.cardTop}>
                <Image source={item.avatar} style={Style.avatar} />
                <View style={Style.doctorInfo}>
                  <Text style={Style.doctorName}>{item.doctor}</Text>
                  <Text style={Style.doctorSpec}>{item.specialty}</Text>
                </View>
                <View style={Style.timeBox}>
                  <Text style={Style.timeText}>{item.time}</Text>
                </View>
              </View>
              
              <View style={Style.cardBottom}>
                <View style={Style.dateInfo}>
                  <Feather name="calendar" size={16} color="#6B7280" />
                  <Text style={Style.dateText}>{item.date}</Text>
                </View>
  
                <TouchableOpacity onPress={() => {nav.navigate("ChatStream")}} style={Style.startBtn} activeOpacity={0.8}>
                  <MaterialCommunityIcons name="video" size={20} color="#FFFFFF" />
                  <Text style={Style.startBtnText}>Bắt đầu khám</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={Style.section}>
          <Text style={Style.sectionTitle}>Lịch sử khám</Text>
          
          {pastAppointments.map((item) => (
            <View key={item.id} style={Style.pastCard}>
              <View style={Style.cardTop}>
                <Image source={item.avatar} style={Style.avatarPast} />
                <View style={Style.doctorInfo}>
                  <Text style={Style.doctorName}>{item.doctor}</Text>
                  <View style={Style.dateInfoPast}>
                    <Feather name="clock" size={14} color="#6B7280" />
                    <Text style={Style.dateTextPast}>{item.date} - {item.time}</Text>
                  </View>
                </View>
              </View>
              
              <View style={Style.cardBottomPast}>
                <View style={[
                  Style.statusBadge, 
                  item.status === 'Đã hủy' ? Style.statusCancel : Style.statusSuccess
                ]}>
                  <Text style={[
                    Style.statusText,
                    item.status === 'Đã hủy' ? Style.statusCancelText : Style.statusSuccessText
                  ]}>
                    {item.status}
                  </Text>
                </View>
                
                <TouchableOpacity style={Style.rebookBtn} activeOpacity={0.8}>
                  <Text style={Style.rebookBtnText}>Đặt lại</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};



export default AllAppointmentTab;