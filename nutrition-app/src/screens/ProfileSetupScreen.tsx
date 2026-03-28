import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { RootStackParamList, UserProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import Crypto from 'expo-crypto';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ProfileSetup'>;
type Route = RouteProp<RootStackParamList, 'ProfileSetup'>;

type Gender = 'male' | 'female' | 'other';

const GENDER_OPTIONS: { value: Gender; label: string; emoji: string }[] = [
  { value: 'male', label: 'Masculino', emoji: '👨' },
  { value: 'female', label: 'Feminino', emoji: '👩' },
  { value: 'other', label: 'Outro', emoji: '🧑' },
];

export default function ProfileSetupScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { signIn } = useAuth();
  const { user: incomingUser } = route.params;

  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [loading, setLoading] = useState(false);

  function validate(): string | null {
    const ageNum = parseInt(age);
    if (!age || isNaN(ageNum) || ageNum < 5 || ageNum > 120) {
      return 'Informe uma idade válida (5–120 anos).';
    }
    const heightNum = parseFloat(height);
    if (!height || isNaN(heightNum) || heightNum < 50 || heightNum > 300) {
      return 'Informe uma altura válida em cm (50–300 cm).';
    }
    const weightNum = parseFloat(weight);
    if (!weight || isNaN(weightNum) || weightNum < 10 || weightNum > 500) {
      return 'Informe um peso válido em kg (10–500 kg).';
    }
    if (!gender) {
      return 'Selecione seu gênero.';
    }
    return null;
  }

  async function handleContinue() {
    const error = validate();
    if (error) {
      Alert.alert('Dados incompletos', error);
      return;
    }

    setLoading(true);
    try {
      const profile: UserProfile = {
        age: parseInt(age),
        height: parseFloat(height),
        weight: parseFloat(weight),
        gender: gender!,
      };

      const id = incomingUser.id ?? (await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        (incomingUser.email ?? '') + Date.now()
      )).substring(0, 16);

      await signIn({
        id,
        email: incomingUser.email ?? '',
        name: incomingUser.name ?? '',
        photoURL: incomingUser.photoURL,
        provider: incomingUser.provider ?? 'email',
        profile,
      });

      navigation.reset({ index: 0, routes: [{ name: 'Chat' }] });
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  const firstName = incomingUser.name?.split(' ')[0] ?? 'usuário';
  const isOAuth = incomingUser.provider === 'google' || incomingUser.provider === 'facebook';

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            {incomingUser.photoURL ? (
              <Image source={{ uri: incomingUser.photoURL }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>
                  {(incomingUser.name ?? 'U')[0].toUpperCase()}
                </Text>
              </View>
            )}
            <Text style={styles.greeting}>
              {isOAuth ? `Olá, ${firstName}! 👋` : `Bem-vindo, ${firstName}! 👋`}
            </Text>
            <Text style={styles.subtitle}>
              Precisamos de algumas informações{'\n'}para personalizar sua experiência.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Age */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Idade</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 28"
                placeholderTextColor={colors.textMuted}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>

            {/* Height + Weight in a row */}
            <View style={styles.row}>
              <View style={[styles.fieldContainer, { flex: 1 }]}>
                <Text style={styles.label}>Altura (cm)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 175"
                  placeholderTextColor={colors.textMuted}
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="decimal-pad"
                  maxLength={5}
                />
              </View>
              <View style={[styles.fieldContainer, { flex: 1 }]}>
                <Text style={styles.label}>Peso (kg)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 70"
                  placeholderTextColor={colors.textMuted}
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="decimal-pad"
                  maxLength={5}
                />
              </View>
            </View>

            {/* Gender */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Gênero</Text>
              <View style={styles.genderRow}>
                {GENDER_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.genderOption,
                      gender === option.value && styles.genderOptionSelected,
                    ]}
                    onPress={() => setGender(option.value)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.genderEmoji}>{option.emoji}</Text>
                    <Text
                      style={[
                        styles.genderLabel,
                        gender === option.value && styles.genderLabelSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* BMI Preview */}
          {age && height && weight && (
            <BMICard height={parseFloat(height)} weight={parseFloat(weight)} />
          )}

          <TouchableOpacity
            style={[styles.continueButton, loading && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.continueButtonText}>
              {loading ? 'Salvando...' : 'Começar a usar →'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function BMICard({ height, weight }: { height: number; weight: number }) {
  if (!height || !weight || height < 50 || weight < 10) return null;
  const bmi = weight / Math.pow(height / 100, 2);
  const bmiRounded = bmi.toFixed(1);

  let classification = '';
  let classColor = '';
  if (bmi < 18.5) { classification = 'Abaixo do peso'; classColor = colors.warning; }
  else if (bmi < 25) { classification = 'Peso normal'; classColor = colors.success; }
  else if (bmi < 30) { classification = 'Sobrepeso'; classColor = colors.warning; }
  else { classification = 'Obesidade'; classColor = colors.accent; }

  return (
    <View style={styles.bmiCard}>
      <Text style={styles.bmiTitle}>IMC Estimado</Text>
      <View style={styles.bmiRow}>
        <Text style={styles.bmiValue}>{bmiRounded}</Text>
        <Text style={[styles.bmiClass, { color: classColor }]}>{classification}</Text>
      </View>
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
    paddingTop: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarInitial: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primaryText,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  form: {
    gap: 20,
    marginBottom: 24,
  },
  fieldContainer: {
    gap: 6,
  },
  label: {
    fontSize: 12,
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
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 10,
  },
  genderOption: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  genderOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}15`,
  },
  genderEmoji: {
    fontSize: 24,
  },
  genderLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  genderLabelSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  bmiCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bmiTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  bmiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bmiValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  bmiClass: {
    fontSize: 14,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: colors.primary,
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryText,
  },
});
