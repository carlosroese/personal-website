import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../types';
import { createEmailUser, validateEmail, validatePassword } from '../services/authService';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name.trim()) {
      Alert.alert('Campo obrigatório', 'Informe seu nome.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('E-mail inválido', 'Informe um e-mail válido.');
      return;
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      Alert.alert('Senha inválida', passwordError);
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Senhas diferentes', 'As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      const user = await createEmailUser(email.toLowerCase().trim(), password, name.trim());
      navigation.navigate('ProfileSetup', { user });
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível criar a conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Voltar</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>Informe seus dados para começar</Text>

          {/* Form */}
          <View style={styles.form}>
            <FormField
              label="Nome completo"
              placeholder="Seu nome"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            <FormField
              label="E-mail"
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor={colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <FormField
              label="Confirmar senha"
              placeholder="Repita a senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={[styles.registerButton, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={colors.primaryText} size="small" />
            ) : (
              <Text style={styles.registerButtonText}>Criar conta</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.termsText}>
            Ao criar conta, você concorda com nossos{' '}
            <Text style={styles.termsLink}>Termos de Uso</Text> e{' '}
            <Text style={styles.termsLink}>Política de Privacidade</Text>.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

interface FormFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  secureTextEntry?: boolean;
}

function FormField({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  secureTextEntry = false,
}: FormFieldProps) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
      />
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
    paddingTop: 16,
  },
  backButton: {
    marginBottom: 24,
  },
  backText: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 32,
  },
  form: {
    gap: 16,
    marginBottom: 28,
  },
  fieldContainer: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 16,
    fontSize: 15,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingRight: 12,
  },
  eyeButton: {
    padding: 4,
  },
  eyeText: {
    fontSize: 18,
  },
  registerButton: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryText,
  },
  termsText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: colors.primary,
  },
});
