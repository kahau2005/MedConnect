import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Channel, MessageList, MessageInput, useChatContext } from 'stream-chat-react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Style from "./Style"

const ChatStream = () => {
  return <View>
    <Text>Chat</Text>
  </View>
};

export default ChatStream;