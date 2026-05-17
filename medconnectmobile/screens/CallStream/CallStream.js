import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { StreamCall, CallContent, useStreamVideoClient } from '@stream-io/video-react-native-sdk';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const CallScreen = () => {
  return <View>
    <Text>Call</Text>
  </View>
}

export default CallScreen;