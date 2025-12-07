import { Ionicons } from "@expo/vector-icons";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import LoginLoader from "@/components/custom/loadingComponent";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { RootState } from "@/redux/store";
import socketService from "@/socketio/socketio";
import axios from "axios";
import { router } from "expo-router";
import { useSelector } from "react-redux";


const Conversations = () => {
  const colorScheme = useColorScheme() ?? "light";
  const themeIconColor = Colors[colorScheme].icon || "#666";
  const themeTextColor = Colors[colorScheme].text;
  const primaryColor = Colors[colorScheme].tint || "#0a7ea4"; // Veya kendi primary rengin

  const [searchText, setSearchText] = useState("");
  const [conversations, setConversations] = useState();
  const {token, loading} = useSelector((state: RootState)=>state);

  useLayoutEffect(()=>{
    
    (async()=>{
      const response = await axios.get(`http://localhost:3002/conversations/?token=${token}`);
      const data = response.data;
      setConversations(data.conversations);
    })()
  }, [token]);

  useEffect(()=>{
    if (token) {
      socketService.connect(token);
      
      socketService.on("newMessage", (message)=>{
      });
    }
  }, [conversations, token]);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.chatItem} 
      onPress={() => router.push({
        pathname: "/(message)/messages",
        params: {
          conversationid: item._id,
          conversationname: item.groupName

        }
      })}
    >
      <Image source={{ uri: "https://static.vecteezy.com/system/resources/previews/046/409/821/non_2x/avatar-profile-icon-in-flat-style-male-user-profile-illustration-on-isolated-background-man-profile-sign-business-concept-vector.jpg"}} style={styles.avatar} />

      <View style={styles.contentContainer}>
        <View style={styles.topRow}>
          <ThemedText type="defaultSemiBold" style={styles.nameText}>
            {item.groupName}
          </ThemedText>
          <ThemedText style={styles.timeText}>{`TIME`}</ThemedText>
        </View>

        <View style={styles.bottomRow}>
          <ThemedText 
            numberOfLines={1} 
            style={[
              styles.messageText, 
              item.unread > 0 ? { color: themeTextColor, fontWeight: '500' } : { color: '#888' }
            ]}
          >
            {item.lastMessage && item.lastMessage.content}
          </ThemedText>
          
          {item.readBy > 0 && (
            <View style={[styles.badge, { backgroundColor: primaryColor }]}>
              <ThemedText style={styles.badgeText}>{item.readBy}</ThemedText>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <LoginLoader visible={loading}/>
      
      <View style={styles.header}>
        <ThemedText type="title">Mesajlar</ThemedText>
        <TouchableOpacity onPress={()=>console.log(token)}>
           <Ionicons name="create-outline" size={28} color={primaryColor} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.inputWrapper, { borderColor: themeIconColor + '30' }]}>
          <Ionicons name="search-outline" size={20} color={themeIconColor} style={styles.searchIcon} />
          <TextInput
            style={[styles.textInput, { color: themeTextColor }]}
            placeholder="Sohbetlerde ara..."
            placeholderTextColor={themeIconColor}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.__v}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

    </ThemedView>
  );
};

export default Conversations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 17, 
    paddingTop: 25, 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  searchContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    backgroundColor: "#1e1e1eff", 
  },
  searchIcon: {
    marginRight: 10,
    opacity: 0.7,
  },
  textInput: {
    flex: 1,
    height: "100%",
    fontSize: 15,
  },
  listContent: {
    paddingBottom: 20,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20, 
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 50, 
    backgroundColor: "#ddd", 
  },
  contentContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  nameText: {
    fontSize: 16,
  },
  timeText: {
    fontSize: 12,
    color: "#888",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  messageText: {
    fontSize: 14,
    flex: 1,
    marginRight: 10,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});