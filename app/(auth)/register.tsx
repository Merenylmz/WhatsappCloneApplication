import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import colors from "@/constants/colors";
import { Colors } from "@/constants/theme";
import axios from "axios";
import { Link, router } from "expo-router";

const Register = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const colorScheme = useColorScheme() ?? "light";
  const themeTextColor = Colors[colorScheme].text;
  const themeIconColor = Colors[colorScheme].icon || "#666"; // Varsa icon rengi, yoksa gri
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const registerTask = async()=>{
    try {
      if (!name || !email || !password) {
        return Alert.alert("Error", "Please Give Valid information", [{
          text: "OK",
        }]);
      }

      const response = await axios.post(`http://localhost:3002/users/register`, {username: name, email, password});
      const data = await response.data as {status: boolean, msg: any, token:any};
      if (!data.status) {
        return Alert.alert("Error", data.msg, [{
          text: "OK", 
        }]);
      }

      return router.push("/(auth)/login");
    } catch (error) {
      console.log(error);
      Alert.alert("Error");
    }
  }

  return (
    <ThemedView style={styles.container}>
      
      <View style={styles.headerContainer}>
        <ThemedText type="title" style={styles.title}>
          Hoş Geldiniz!
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Giriş Yapabilmek için Kayıt olun
        </ThemedText>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Email</ThemedText>
          <View style={[styles.inputWrapper, { borderColor: themeIconColor + '40' }]}>
            <Ionicons name="person" size={20} color={themeIconColor} style={styles.inputIcon} />
            <TextInput
              style={[styles.textInput, { color: themeTextColor }]}
              placeholder="Name"
              placeholderTextColor={themeIconColor}
              keyboardType="default"
              autoCapitalize="none"
              onChangeText={setName}
              value={name}
            />
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Email</ThemedText>
          <View style={[styles.inputWrapper, { borderColor: themeIconColor + '40' }]}>
            <Ionicons name="mail-outline" size={20} color={themeIconColor} style={styles.inputIcon} />
            <TextInput
              style={[styles.textInput, { color: themeTextColor }]}
              placeholder="ornek@email.com"
              placeholderTextColor={themeIconColor}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={setEmail}
              value={email}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Şifre</ThemedText>
          <View style={[styles.inputWrapper, { borderColor: themeIconColor + '40' }]}>
            <Ionicons name="lock-closed-outline" size={20} color={themeIconColor} style={styles.inputIcon} />
            <TextInput
              style={[styles.textInput, { color: themeTextColor }]}
              placeholder="••••••••"
              placeholderTextColor={themeIconColor}
              secureTextEntry={!isPasswordVisible}
              onChangeText={setPassword}
              value={password}
            />
            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
              <Ionicons
                name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={themeIconColor}
              />
            </TouchableOpacity>
          </View>
        </View>


        <TouchableOpacity style={[styles.loginButton, { backgroundColor: colors.primaryColor }]} onPress={()=>registerTask()}>
          <ThemedText style={styles.loginButtonText}>Kayıt Ol</ThemedText>
        </TouchableOpacity>

      </View>

      <View style={styles.footerContainer}>
        <ThemedText style={styles.footerText}>Zaten bir Hesabın var mı? </ThemedText>
        <Link href={`/login`}>
          <TouchableOpacity>
            <ThemedText style={[styles.signupText, { color: "#ccc" }]}>
              Giriş Yap
            </ThemedText>
          </TouchableOpacity>
        </Link>
      </View>
      <View style={styles.footerContainer}>
        <Link href={`/qrLogin`}>
          <TouchableOpacity>
            <ThemedText style={[styles.signupText, { color: "#ccc" }]}>
              QR ile Giriş
            </ThemedText>
          </TouchableOpacity>
        </Link>
      </View>
      
    </ThemedView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center", // Dikeyde ortala
  },
  headerContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  formContainer: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    opacity: 0.9,
  },
  // Input'un dışındaki modern çerçeve
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12, // Yumuşak köşeler
    paddingHorizontal: 12,
    height: 50, // Sabit yükseklik iyidir
    // Hafif bir arka plan rengi vererek inputu vurgulayabiliriz (isteğe bağlı)
    // backgroundColor: colorScheme === 'dark' ? '#ffffff10' : '#00000005', 
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1, // Kalan boşluğu doldur
    height: "100%",
    fontSize: 16,
  },
  forgotPasswordBtn: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.8,
  },
  loginButton: {
    height: 56,
    borderRadius: 16, // Buton daha yuvarlak
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primaryColor,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8, // Android için gölge
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
  },
  signupText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});