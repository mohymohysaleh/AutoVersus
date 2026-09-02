import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ComparisonCar } from '../types/comparison.types';
import { sendChatMessageToAiAdvisor } from '../services/comparison-api.service';

interface AiChatModalProps {
  visible: boolean;
  carsInComparison: ComparisonCar[];
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

const SUGGESTED_QUESTIONS = [
  'Which car holds better resale value in Egypt?',
  'Are spare parts easy to find in Cairo?',
  'What are the real maintenance costs?',
  'Which car has better safety & build quality?',
];

export const AiChatModal: React.FC<AiChatModalProps> = ({
  visible,
  carsInComparison,
  onClose,
}) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const flatListRef = useRef<FlatList>(null);

  // Initialize initial welcome message
  useEffect(() => {
    if (visible && messages.length === 0) {
      const carNames = carsInComparison.map((c) => `${c.brandName} ${c.modelName}`).join(' & ');
      const welcomeText = carNames
        ? `Hello! I am your AutoVersus AI Car Advisor. I see you are currently comparing ${carNames}.\n\nAsk me anything about these vehicles, maintenance costs in Egypt, resale value, or general car buying advice!`
        : `Hello! I am your AutoVersus AI Car Advisor.\n\nAsk me any question about cars, specs, maintenance costs, reliability, or Egyptian market advice!`;

      setMessages([
        {
          id: 'msg-welcome',
          sender: 'ai',
          text: welcomeText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [visible, carsInComparison]);

  const handleSend = async (customQuestion?: string) => {
    const textToSend = (customQuestion || inputText).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customQuestion) setInputText('');
    setIsLoading(true);

    try {
      // Build API history
      const history = [...messages, userMsg].map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: m.text,
      }));

      const aiReplyText = await sendChatMessageToAiAdvisor(history, carsInComparison);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReplyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.warn('Chat reply error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    const carNames = carsInComparison.map((c) => `${c.brandName} ${c.modelName}`).join(' & ');
    const welcomeText = carNames
      ? `Hello! I am your AutoVersus AI Car Advisor. I see you are currently comparing ${carNames}.\n\nAsk me anything about these vehicles, maintenance costs in Egypt, resale value, or general car buying advice!`
      : `Hello! I am your AutoVersus AI Car Advisor.\n\nAsk me any question about cars, specs, maintenance costs, reliability, or Egyptian market advice!`;

    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        sender: 'ai',
        text: welcomeText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInputText('');
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isLoading]);

  const renderFormattedText = (rawText: string, isUser: boolean) => {
    if (isUser) {
      return <Text style={styles.userMessageText}>{rawText}</Text>;
    }

    // Pre-process text: Strip markdown table headers like |---|---|
    const cleanedText = rawText
      .replace(/^\|?[\s:-|-]+\|?$/gm, '') // Strip table separator lines
      .replace(/^##+\s*(.*)$/gm, '\n❖ $1') // Convert markdown headers to section titles
      .replace(/\|\s*/g, ' • ') // Replace table cell pipes with bullets
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    const paragraphs = cleanedText.split('\n');

    return (
      <View style={styles.formattedTextContainer}>
        {paragraphs.map((p, idx) => {
          const line = p.trim();
          if (!line) return <View key={idx} style={{ height: 6 }} />;

          const isHeader = line.startsWith('❖');
          const isBullet = line.startsWith('•') || line.startsWith('-');

          // Parse **bold** text segments
          const parts = line.split(/(\*\*.*?\*\*)/g);

          return (
            <Text
              key={idx}
              style={[
                styles.aiMessageText,
                isHeader && styles.headerLineText,
                isBullet && styles.bulletLineText,
              ]}
            >
              {parts.map((part, pIdx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return (
                    <Text key={pIdx} style={styles.boldText}>
                      {part.slice(2, -2)}
                    </Text>
                  );
                }
                return part;
              })}
            </Text>
          );
        })}
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.container}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.botAvatar}>
                <Ionicons name="chatbubbles" size={18} color="#FFFFFF" />
              </View>

              <View style={styles.headerTextGroup}>
                <Text style={styles.headerTitle}>AutoVersus AI Advisor</Text>
                <View style={styles.onlineBadge}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.onlineText}>Online • Grok AI Engine</Text>
                </View>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <TouchableOpacity
                style={styles.headerIconButton}
                onPress={handleClearChat}
                activeOpacity={0.8}
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.8}>
                <Ionicons name="close" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Context Strip if cars selected */}
          {carsInComparison.length > 0 && (
            <View style={styles.contextStrip}>
              <Ionicons name="car-sport" size={14} color="#0F3040" />
              <Text style={styles.contextStripText} numberOfLines={1}>
                Active Context: {carsInComparison.map((c) => `${c.brandName} ${c.modelName}`).join(' vs ')}
              </Text>
            </View>
          )}

          {/* Messages List */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageBubble,
                  item.sender === 'user' ? styles.userBubble : styles.aiBubble,
                ]}
              >
                {item.sender === 'ai' && (
                  <View style={styles.aiBadgeLabel}>
                    <Ionicons name="sparkles" size={10} color="#0F3040" />
                    <Text style={styles.aiBadgeText}>AI ADVISOR</Text>
                  </View>
                )}
                {renderFormattedText(item.text, item.sender === 'user')}
                <Text
                  style={[
                    styles.timeText,
                    item.sender === 'user' ? styles.userTimeText : styles.aiTimeText,
                  ]}
                >
                  {item.time}
                </Text>
              </View>
            )}
            ListFooterComponent={
              isLoading ? (
                <View style={[styles.messageBubble, styles.aiBubble, styles.loadingBubble]}>
                  <ActivityIndicator size="small" color="#0F3040" />
                  <Text style={styles.typingText}>Grok AI is thinking...</Text>
                </View>
              ) : null
            }
          />

          {/* Quick Suggestions */}
          <View style={styles.suggestionsWrapper}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={SUGGESTED_QUESTIONS}
              keyExtractor={(_, i) => i.toString()}
              contentContainerStyle={styles.suggestionsContainer}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionChip}
                  onPress={() => handleSend(item)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="help-circle-outline" size={13} color="#0F3040" />
                  <Text style={styles.suggestionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* Input Bar */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Ask any question about cars, reliability, prices..."
              placeholderTextColor="#94A3B8"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={400}
            />

            <TouchableOpacity
              style={[
                styles.sendButton,
                !inputText.trim() || isLoading ? styles.disabledSend : styles.activeSend,
              ]}
              onPress={() => handleSend()}
              disabled={!inputText.trim() || isLoading}
              activeOpacity={0.85}
            >
              <Ionicons name="send" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F3040',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F3040',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E495E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  headerTextGroup: {
    gap: 2,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  onlineText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contextStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 48, 64, 0.06)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  contextStripText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F3040',
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 14,
  },
  messageBubble: {
    maxWidth: '84%',
    borderRadius: 18,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#0F3040',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  aiBadgeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F3040',
    letterSpacing: 0.5,
  },
  formattedTextContainer: {
    gap: 4,
  },
  headerLineText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F3040',
    marginTop: 6,
    marginBottom: 2,
  },
  bulletLineText: {
    paddingLeft: 2,
    lineHeight: 22,
  },
  boldText: {
    fontWeight: '800',
    color: '#0F3040',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 21,
  },
  userMessageText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 21,
  },
  aiMessageText: {
    color: '#0F2942',
    fontSize: 13.5,
    lineHeight: 21,
  },
  timeText: {
    fontSize: 10,
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  userTimeText: {
    color: '#94A3B8',
  },
  aiTimeText: {
    color: '#94A3B8',
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
  },
  typingText: {
    fontSize: 13,
    color: '#0F3040',
    fontWeight: '600',
  },
  suggestionsWrapper: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  suggestionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 6,
  },
  suggestionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F3040',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F3040',
    maxHeight: 90,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeSend: {
    backgroundColor: '#0F3040',
  },
  disabledSend: {
    backgroundColor: '#94A3B8',
  },
});
