import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
  KeyboardAvoidingView,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { colors } from '../theme/colors';
import { ChatMessage, NutritionResult } from '../types';
import {
  analyzeTextFood,
  analyzeImageFood,
  formatNutritionMessage,
} from '../services/nutritionService';
import { useAuth } from '../context/AuthContext';

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  type: 'assistant',
  content:
    'Olá! 👋 Eu sou seu assistente nutricional.\n\nVocê pode:\n• Digitar os alimentos que está comendo com o peso (ex: "100g de frango grelhado e 200g de arroz")\n• Enviar uma foto do seu prato 📸 e eu identifico automaticamente!\n\nComo posso ajudar?',
  timestamp: new Date(),
};

export default function ChatScreen() {
  const { user, signOut } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const listRef = useRef<FlatList>(null);

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

  async function handleSendText() {
    const text = inputText.trim();
    if (!text || isLoading) return;

    setInputText('');
    addMessage({
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date(),
    });

    setIsLoading(true);
    const loadingId = `loading-${Date.now()}`;
    addMessage({ id: loadingId, type: 'loading', content: '', timestamp: new Date() });

    try {
      const result = await analyzeTextFood(text);
      setMessages((prev) => prev.filter((m) => m.id !== loadingId));
      addMessage({
        id: Date.now().toString(),
        type: 'assistant',
        content: formatNutritionMessage(result),
        nutrition: result,
        timestamp: new Date(),
      });
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== loadingId));
      const isApiKeyError = err instanceof Error && err.message === 'API_KEY_MISSING';
      addMessage({
        id: Date.now().toString(),
        type: 'error',
        content: isApiKeyError
          ? '⚠️ Chave de API não configurada. Adicione sua ANTHROPIC_API_KEY no arquivo app.json > extra.'
          : '❌ Não consegui analisar os alimentos. Tente descrever de forma mais específica (ex: "150g de peito de frango grelhado").',
        timestamp: new Date(),
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleImageFromCamera() {
    setShowImageModal(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera para analisar fotos de alimentos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      await processImage(result.assets[0]);
    }
  }

  async function handleImageFromGallery() {
    setShowImageModal(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para analisar fotos de alimentos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      await processImage(result.assets[0]);
    }
  }

  async function processImage(asset: ImagePicker.ImagePickerAsset) {
    const imageUri = asset.uri;

    addMessage({
      id: Date.now().toString(),
      type: 'user',
      content: '📸 Foto enviada para análise',
      imageUri,
      timestamp: new Date(),
    });

    setIsLoading(true);
    const loadingId = `loading-${Date.now()}`;
    addMessage({ id: loadingId, type: 'loading', content: '', timestamp: new Date() });

    try {
      let base64Data = asset.base64;

      if (!base64Data) {
        base64Data = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }

      const extension = imageUri.split('.').pop()?.toLowerCase() ?? 'jpg';
      const mimeType =
        extension === 'png' ? 'image/png' :
        extension === 'webp' ? 'image/webp' :
        'image/jpeg';

      const result = await analyzeImageFood(base64Data!, mimeType);
      setMessages((prev) => prev.filter((m) => m.id !== loadingId));
      addMessage({
        id: Date.now().toString(),
        type: 'assistant',
        content: formatNutritionMessage(result),
        nutrition: result,
        timestamp: new Date(),
      });
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== loadingId));
      const isApiKeyError = err instanceof Error && err.message === 'API_KEY_MISSING';
      addMessage({
        id: Date.now().toString(),
        type: 'error',
        content: isApiKeyError
          ? '⚠️ Chave de API não configurada. Adicione sua ANTHROPIC_API_KEY no arquivo app.json > extra.'
          : '❌ Não consegui analisar a imagem. Certifique-se de que a foto mostra os alimentos claramente.',
        timestamp: new Date(),
      });
    } finally {
      setIsLoading(false);
    }
  }

  function renderMessage({ item }: { item: ChatMessage }) {
    if (item.type === 'loading') {
      return (
        <View style={[styles.messageBubble, styles.assistantBubble]}>
          <ActivityIndicator color={colors.primary} size="small" />
          <Text style={styles.loadingText}>Analisando...</Text>
        </View>
      );
    }

    const isUser = item.type === 'user';
    const isError = item.type === 'error';

    return (
      <View style={[styles.messageRow, isUser && styles.messageRowUser]}>
        {!isUser && (
          <View style={styles.botAvatar}>
            <Text style={styles.botAvatarText}>🥗</Text>
          </View>
        )}
        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.assistantBubble,
          isError && styles.errorBubble,
        ]}>
          {item.imageUri && (
            <Image source={{ uri: item.imageUri }} style={styles.messageImage} />
          )}
          {item.content ? (
            <FormattedText
              text={item.content}
              isUser={isUser}
            />
          ) : null}
          {item.nutrition && <NutritionSummary result={item.nutrition} />}
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>🥗</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>NutriTrack</Text>
            <Text style={styles.headerSubtitle}>Assistente nutricional</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() =>
            Alert.alert(
              user?.name ?? 'Perfil',
              `E-mail: ${user?.email}\nPeso: ${user?.profile?.weight}kg\nAltura: ${user?.profile?.height}cm`,
              [
                { text: 'Fechar' },
                { text: 'Sair', style: 'destructive', onPress: signOut },
              ]
            )
          }
        >
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.profileAvatar} />
          ) : (
            <View style={styles.profileAvatarPlaceholder}>
              <Text style={styles.profileAvatarInitial}>
                {(user?.name ?? 'U')[0].toUpperCase()}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Input area */}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.imageButton}
            onPress={() => setShowImageModal(true)}
            disabled={isLoading}
          >
            <Text style={styles.imageButtonIcon}>📷</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            placeholder="Ex: 150g de frango, 200g de arroz..."
            placeholderTextColor={colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={handleSendText}
            blurOnSubmit={false}
          />

          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
            onPress={handleSendText}
            disabled={!inputText.trim() || isLoading}
          >
            <Text style={styles.sendButtonText}>→</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Image Source Modal */}
      <Modal
        visible={showImageModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowImageModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowImageModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enviar foto</Text>

            <TouchableOpacity style={styles.modalOption} onPress={handleImageFromCamera}>
              <Text style={styles.modalOptionIcon}>📷</Text>
              <Text style={styles.modalOptionText}>Tirar foto agora</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalOption} onPress={handleImageFromGallery}>
              <Text style={styles.modalOptionIcon}>🖼️</Text>
              <Text style={styles.modalOptionText}>Escolher da galeria</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowImageModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

// Renders bold text wrapped in *...*
function FormattedText({ text, isUser }: { text: string; isUser: boolean }) {
  const baseColor = isUser ? colors.userBubbleText : colors.textPrimary;
  const parts = text.split(/(\*[^*]+\*|─+)/g);

  return (
    <Text style={[styles.messageText, { color: baseColor }]}>
      {parts.map((part, i) => {
        if (part.startsWith('*') && part.endsWith('*')) {
          return (
            <Text key={i} style={{ fontWeight: '700', color: isUser ? colors.userBubbleText : colors.primary }}>
              {part.slice(1, -1)}
            </Text>
          );
        }
        if (/^─+$/.test(part)) {
          return <Text key={i} style={{ color: colors.border }}>{part}</Text>;
        }
        return <Text key={i}>{part}</Text>;
      })}
    </Text>
  );
}

function NutritionSummary({ result }: { result: NutritionResult }) {
  const t = result.total;
  return (
    <View style={styles.nutritionSummary}>
      <NutritionPill label="Carbs" value={`${t.carbs}g`} color={colors.carbsColor} />
      <NutritionPill label="Prot" value={`${t.protein}g`} color={colors.proteinColor} />
      <NutritionPill label="Gord" value={`${t.fat}g`} color={colors.fatColor} />
      <NutritionPill label="Kcal" value={`${t.calories}`} color={colors.caloriesColor} />
    </View>
  );
}

function NutritionPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[styles.pill, { borderColor: color }]}>
      <Text style={[styles.pillValue, { color }]}>{value}</Text>
      <Text style={styles.pillLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: {
    fontSize: 22,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  profileButton: {
    padding: 2,
  },
  profileAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  profileAvatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarInitial: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  messageList: {
    padding: 16,
    paddingBottom: 8,
    gap: 12,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  messageRowUser: {
    flexDirection: 'row-reverse',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  botAvatarText: {
    fontSize: 18,
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
    gap: 8,
  },
  userBubble: {
    backgroundColor: colors.userBubble,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: colors.assistantBubble,
    borderBottomLeftRadius: 4,
    flexDirection: 'column',
  },
  errorBubble: {
    backgroundColor: `${colors.accent}20`,
    borderWidth: 1,
    borderColor: `${colors.accent}60`,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 13,
    marginLeft: 6,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  nutritionSummary: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  pill: {
    borderRadius: 8,
    borderWidth: 1.5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    minWidth: 52,
  },
  pillValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  pillLabel: {
    fontSize: 9,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    gap: 8,
  },
  imageButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  imageButtonIcon: {
    fontSize: 20,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textPrimary,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primaryText,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 14,
    padding: 16,
  },
  modalOptionIcon: {
    fontSize: 24,
  },
  modalOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  modalCancel: {
    marginTop: 4,
    alignItems: 'center',
    padding: 12,
  },
  modalCancelText: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
