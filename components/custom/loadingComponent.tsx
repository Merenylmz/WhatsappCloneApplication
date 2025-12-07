import { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Modal,
  StyleSheet,
  Text,
  View
} from 'react-native';

interface LoginLoaderProps {
  visible: boolean;
}

const LoginLoader = ({ visible }: LoginLoaderProps) => {
  // Animasyon değerleri
  const scaleValue = useRef(new Animated.Value(1)).current; // Büyüme/Küçülme için
  const opacityValue = useRef(new Animated.Value(0)).current; // Yazının yavaşça gelmesi için

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;

    if (visible) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleValue, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      
      animation.start();

      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
      
    } else {
      opacityValue.setValue(0);
    }

    return () => {
      if (animation) {
        animation.stop(); // animasyonu bitirmez isek flatlistlerde sorun yaşanıyor (router. ile gittiğimiz yerlerde)
      }
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      transparent={false} 
      animationType="fade" // Sayfa geçişi gibi yumuşak gelsin
      visible={visible}
      statusBarTranslucent={true}
    >
      <View style={styles.container}>
        

        {/* --- ALT BİLGİ KISMI --- */}
        <Animated.View style={[styles.logoContainer, { opacity: opacityValue }]}>
          <ActivityIndicator size="large" color="#ffffff" style={styles.spinner} />
          <Text style={styles.title}>Giriş Yapılıyor</Text>
          <Text style={styles.subTitle}>Bilgileriniz doğrulanıyor, lütfen bekleyin...</Text>
        </Animated.View>

      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', // LOGIN EKRANININ RENGİNİ BURAYA YAZ (Örn: #1a1a1a veya gradient)
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 50,
  },
  placeholderLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffffff', // Logo arka planı
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#4c669f',
  },
  
  spinner: {
    marginBottom: 15,
    transform: [{ scale: 1.2 }] // Spinner'ı biraz büyütelim
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    letterSpacing: 1,
  },
  subTitle: {
    color: 'rgba(255, 255, 255, 0.7)', // Hafif silik beyaz
    fontSize: 14,
  },
});

export default LoginLoader;