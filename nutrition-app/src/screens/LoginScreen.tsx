import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../types';
import { signInWithGoogle, signInWithFacebook } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import Constants from 'expo-constants';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const GOOGLE_CONFIGURED = !!Constants.expoConfig?.extra?.GOOGLE_CLIENT_ID;
const FACEBOOK_CONFIGURED = !!Constants.expoConfig?.extra?.FACEBOOK_APP_ID;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { signIn } = useAuth();
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingFacebook, setLoadingFacebook] = useState(false);

  async function handleGoogleLogin() {
    if (!GOOGLE_CONFIGURED) {
      Alert.alert(
        'Configuração necessária',
        'O Google Client ID não está configurado em app.json. Consulte o README para instruções.'
      );
      return;
    }
    setLoadingGoogle(true);
    try {
      const userData = await signInWithGoogle();
      navigation.navigate('ProfileSetup', { user: userData });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao conectar com Google.';
      Alert.alert('Erro', message);
    } finally {
      setLoadingGoogle(false);
    }
  }

  async function handleFacebookLogin() {
    if (!FACEBOOK_CONFIGURED) {
      Alert.alert(
        'Configuração necessária',
        'O Facebook App ID não está configurado em app.json. Consulte o README para instruções.'
      );
      return;
    }
    setLoadingFacebook(false);
    try {
      const userData = await signInWithFacebook();
      navigation.navigate('ProfileSetup', { user: userData });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao conectar com Facebook.';
      Alert.alert('Erro', message);
    } finally {
      setLoadingFacebook(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Logo + Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.logoGradient}
            >
              <Text style={styles.logoEmoji}>🥗</Text>
            </LinearGradient>
          </View>
          <Text style={styles.appName}>NutriTrack</Text>
          <Text style={styles.tagline}>Seu assistente nutricional inteligente</Text>
        </View>

        {/* Social Login */}
        <View style={styles.socialSection}>
          <Text style={styles.sectionTitle}>Entrar com</Text>

          <TouchableOpacity
            style={[styles.socialButton, styles.googleButton]}
            onPress={handleGoogleLogin}
            disabled={loadingGoogle}
            activeOpacity={0.8}
          >
            {loadingGoogle ? (
              <ActivityIndicator color="#000" size="small" />
            ) : (
              <>
                <Text style={styles.googleIcon}>G</Text>
                <Text style={styles.googleButtonText}>Continuar com Google</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.socialButton, styles.facebookButton]}
            onPress={handleFacebookLogin}
            disabled={loadingFacebook}
            activeOpacity={0.8}
          >
            {loadingFacebook ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={styles.facebookIcon}>f</Text>
                <Text style={styles.facebookButtonText}>Continuar com Facebook</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Email Login */}
        <TouchableOpacity
          style={styles.emailButton}
          onPress={() => navigation.navigate('Register')}
          activeOpacity={0.8}
        >
          <Text style={styles.emailButtonText}>Cadastrar com e-mail</Text>
        </TouchableOpacity>

        {/* Features Preview */}
        <View style={styles.featuresContainer}>
          <Feature icon="💬" text="Chat inteligente de nutrição" />
          <Feature icon="📸" text="Análise nutricional por foto" />
          <Feature icon="🎯" text="Resultados precisos com IA" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Feature({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.featureRow}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 6,
  },
  socialSection: {
    gap: 12,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 14,
    gap: 10,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4285F4',
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  facebookButton: {
    backgroundColor: '#1877F2',
  },
  facebookIcon: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  facebookButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  emailButton: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  emailButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  featuresContainer: {
    gap: 14,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    fontSize: 22,
  },
  featureText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
