import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";

const MESSAGES_DATA = [
  {
    id: "1",
    name: "Ahmet Yılmaz",
    message: "Reisim projeyi ne yaptın? Bitti mi?",
    time: "14:30",
    avatar: "https://i.pravatar.cc/150?u=1",
    unread: 2,
  },
  {
    id: "2",
    name: "Ayşe Demir",
    message: "Tamamdır, yarın toplantıda görüşürüz.",
    time: "12:15",
    avatar: "https://i.pravatar.cc/150?u=2",
    unread: 0,
  },
  {
    id: "3",
    name: "Mehmet Çelik",
    message: "Dosyaları mail attım, kontrol eder misin?",
    time: "Dün",
    avatar: "https://i.pravatar.cc/150?u=3",
    unread: 0,
  },
  {
    id: "4",
    name: "Zeynep Kaya",
    message: "Harika olmuş, eline sağlık! 👏",
    time: "Dün",
    avatar: "https://i.pravatar.cc/150?u=4",
    unread: 1,
  },
  {
    id: "5",
    name: "Teknik Destek",
    message: "Talebiniz alınmıştır.",
    time: "Pzt",
    avatar: "https://i.pravatar.cc/150?u=5",
    unread: 0,
  },
];

const Messages = () => {
  const colorScheme = useColorScheme() ?? "light";
  const themeIconColor = Colors[colorScheme].icon || "#666";
  const themeTextColor = Colors[colorScheme].text;
  const primaryColor = Colors[colorScheme].tint || "#0a7ea4"; // Veya kendi primary rengin

  const [searchText, setSearchText] = useState("");

  const renderItem = ({ item }: { item: typeof MESSAGES_DATA[0] }) => (
    <TouchableOpacity 
      style={styles.chatItem} 
      onPress={() => console.log("Sohbete git: ", item.name)}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />

      <View style={styles.contentContainer}>
        <View style={styles.topRow}>
          <ThemedText type="defaultSemiBold" style={styles.nameText}>
            {item.name}
          </ThemedText>
          <ThemedText style={styles.timeText}>{item.time}</ThemedText>
        </View>

        <View style={styles.bottomRow}>
          <ThemedText 
            numberOfLines={1} 
            style={[
              styles.messageText, 
              item.unread > 0 ? { color: themeTextColor, fontWeight: '500' } : { color: '#888' }
            ]}
          >
            {item.message}
          </ThemedText>
          
          {item.unread > 0 && (
            <View style={[styles.badge, { backgroundColor: primaryColor }]}>
              <ThemedText style={styles.badgeText}>{item.unread}</ThemedText>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      
      <View style={styles.header}>
        <ThemedText type="title">Mesajlar</ThemedText>
        <TouchableOpacity>
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
        data={MESSAGES_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

    </ThemedView>
  );
};

export default Messages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 17, 
    paddingTop: 10, 
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