import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { RootState } from "@/redux/store";
import socketService from "@/socketio/socketio";
import axios from "axios";
import { useSelector } from "react-redux";

const Messages = () => {
  const { conversationid, conversationname } = useLocalSearchParams();
  const [messages, setMessages] = useState<any[]>([]);
  const state = useSelector((state: RootState)=>state.auth) as {user: any, token: string}; 
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const colorScheme = useColorScheme() ?? "light";
  const themeTextColor = Colors[colorScheme].text;
  const themeIconColor = Colors[colorScheme].icon || "#666";
  const primaryColor = Colors[colorScheme].tint || "#0a7ea4";
  
  const otherBubbleColor = colorScheme === 'dark' ? '#2A2A2A' : '#f0f0f0';

    const handleSend = () => {
        if (inputText.trim().length === 0 || !state.user) return;

        socketService.sendMessage({
          conversationId: conversationid,
          content: inputText
        });

        // setMessages((prev) => [...prev, ]);
        setInputText("");
    };

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  useLayoutEffect(()=>{
    (async()=>{
      const response = await axios.get(`http://localhost:3002/messages?conversationid=${conversationid}`);
      const data = response.data;
      setMessages(data.messages);
    })()
  }, [conversationid, state]); 

  useEffect(()=>{
    socketService.connect(state.token);

    if (conversationid) {
      socketService.joinRoom(conversationid as string);
    }

    socketService.on("newMessage", (message)=>{
      console.log(message);
      
      const validMessageForm = {
        ...message,
        sender: message.sender._id
      };
      setMessages((prevMessages: any)=>{
        const isExists = prevMessages.some((msg: any) => msg._id === validMessageForm._id);
        if (isExists) return prevMessages;
        return [...prevMessages, validMessageForm];
      });
    });
  }, [conversationid, state.token]);


  const renderMessage = ({ item }: { item: any }) => {
    const isMe = state.user._id === item.sender;

    
    return (
      <View style={[
        styles.messageRow, 
        isMe ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }
      ]}>
        {/* {!isMe && (
           // Karşı tarafın küçük avatarı (Opsiyonel)
           <Image source={{ uri: "https://i.pravatar.cc/150?u=2" }} style={styles.smallAvatar} />
        )} */}

        <View style={[
          styles.bubble,
          isMe 
            ? { backgroundColor: otherBubbleColor , borderBottomRightRadius: 4 } 
            : { backgroundColor: "#313131ff", borderBottomLeftRadius: 4 }
        ]}>
          <ThemedText style={[
            styles.messageText, 
            isMe ? { color: 'white' } : { color: themeTextColor }
          ]}>
            {item.content}
          </ThemedText>
          
          <ThemedText style={[
            styles.timeText, 
            isMe ? { color: 'rgba(255,255,255,0.7)' } : { color: '#999', textAlign: 'right' }
          ]}>
            {/* {item.time} */}
          </ThemedText>
        </View>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      
      <View style={[styles.header, { borderBottomColor: themeIconColor + '20' }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={themeIconColor} />
        </TouchableOpacity>
        
        <Image source={{ uri: "https://i.pravatar.cc/150?u=2" }} style={styles.headerAvatar} />
        
        <View style={styles.headerInfo}>
          <ThemedText type="defaultSemiBold" style={styles.headerName}>{conversationname}</ThemedText>
          <ThemedText style={styles.headerStatus}>Çevrimiçi</ThemedText>
        </View>

        <TouchableOpacity>
           <Ionicons name="videocam-outline" size={24} color={primaryColor} style={{ marginRight: 15 }} />
        </TouchableOpacity>
        <TouchableOpacity>
           <Ionicons name="call-outline" size={22} color={primaryColor} />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={renderMessage}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={[styles.inputContainer, { borderTopColor: themeIconColor + '10' }]}>
          
          <TouchableOpacity style={styles.attachButton}>
             <Ionicons name="add" size={28} color={primaryColor} />
          </TouchableOpacity>

          <View style={[styles.inputWrapper, { borderColor: themeIconColor + '30', backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#f9f9f9' }]}>
            <TextInput
              style={[styles.textInput, { color: themeTextColor }]}
              placeholder="Bir mesaj yaz..."
              placeholderTextColor="#999"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
          </View>

          <TouchableOpacity 
            onPress={handleSend} 
            style={[styles.sendButton, { backgroundColor: inputText.trim() ? primaryColor : '#6f6c6cff' }]}
            disabled={!inputText.trim()}
          >
             <Ionicons name="send" size={18} color="white" style={{ marginLeft: 2 }} />
          </TouchableOpacity>
          
        </View>
      </KeyboardAvoidingView>

    </ThemedView>
  );
};

export default Messages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10, 
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 10,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
  },
  headerStatus: {
    fontSize: 12,
    color: "#0a7ea4", // Online rengi
    fontWeight: "600",
  },
  // --- LİSTE ---
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end', // Avatar en altta dursun
  },
  smallAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 2,
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18, // Yuvarlak hatlar
  },
  messageText: {
    fontSize: 15,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 10,
    alignSelf: 'flex-end',
  },
  // --- INPUT ALANI ---
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10, // iPhone alt çizgi payı
  },
  attachButton: {
    marginRight: 10,
    padding: 5,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 24, // Tam yuvarlak input
    paddingHorizontal: 18,
    minHeight: 44,
    maxHeight: 100, // Çok satır yazınca uzasın ama ekranı kaplamasın
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 10, // Yazı dikeyde ortalı olsun
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22, // Yuvarlak buton
    justifyContent: 'center',
    alignItems: 'center',
  },
});