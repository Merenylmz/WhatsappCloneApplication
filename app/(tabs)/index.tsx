import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Selamın Aleyküm!</ThemedText>
      <ThemedText style={styles.subtitle}>Burası artık senin çöplüğün.</ThemedText>
      <Link href={"/login"}>
        <ThemedText>Denemeeee</ThemedText>
      </Link>
      <Link href={"/register"}>
        <ThemedText>Denemeeee</ThemedText>
      </Link>
      <Link href={"/qrLogin"}>
        <ThemedText>Denemeeee</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
  },
});
