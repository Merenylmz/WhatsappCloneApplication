import { Colors } from "@/constants/theme";
import { Image, StyleSheet, TouchableOpacity, useColorScheme, View } from "react-native";
import { ThemedText } from "../themed-text";

const ConversationRenderedItem = ({item}: {item: any}) => {
  const colorScheme = useColorScheme() ?? "light";
  const themeTextColor = Colors[colorScheme].text;
  const primaryColor = Colors[colorScheme].tint || "#0a7ea4"; 

  return (
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
};

export default ConversationRenderedItem;

const styles = StyleSheet.create({
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
