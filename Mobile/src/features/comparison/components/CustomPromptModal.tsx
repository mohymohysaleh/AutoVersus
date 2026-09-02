import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CustomPromptModalProps {
  visible: boolean;
  currentPrompt: string;
  onClose: () => void;
  onApplyPrompt: (prompt: string) => void;
}

const PRESET_PROMPTS = [
  'Daily Cairo commute, gentle driver who prioritizes fuel economy over top speed',
  'Family weekend trip car, maximum safety features, trunk space, and legroom',
  'Speed enthusiast looking for highest horsepower and fastest 0-100 acceleration',
  'Lowest initial purchase price and cheap long-term maintenance cost',
];

export const CustomPromptModal: React.FC<CustomPromptModalProps> = ({
  visible,
  currentPrompt,
  onClose,
  onApplyPrompt,
}) => {
  const [promptText, setPromptText] = useState(currentPrompt);

  const handleApply = () => {
    onApplyPrompt(promptText);
    onClose();
  };

  const handleClear = () => {
    setPromptText('');
    onApplyPrompt('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            {/* Header */}
            <View style={styles.headerRow}>
              <View style={styles.headerTitleGroup}>
                <View style={styles.iconCircle}>
                  <Ionicons name="sparkles" size={18} color="#0F3040" />
                </View>
                <Text style={styles.title}>AI Decision Personalizer</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.subTitle}>
              Tell AutoVersus AI how you plan to drive. The AI will re-weight the specs and adjust the verdict.
            </Text>

            {/* Text Input */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                multiline
                numberOfLines={4}
                placeholder="Example: I am a daily Cairo commuter looking for fuel efficiency and quiet ride, I don't speed..."
                placeholderTextColor="#94A3B8"
                value={promptText}
                onChangeText={setPromptText}
                textAlignVertical="top"
              />
            </View>

            {/* Quick Chip Presets */}
            <Text style={styles.presetsLabel}>QUICK DRIVER PRESETS</Text>
            <View style={styles.chipsContainer}>
              {PRESET_PROMPTS.map((preset, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.chip}
                  onPress={() => setPromptText(preset)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="flash-outline" size={12} color="#0F3040" />
                  <Text style={styles.chipText} numberOfLines={1}>
                    {preset.split(',')[0]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              {currentPrompt ? (
                <TouchableOpacity style={styles.resetBtn} onPress={handleClear} activeOpacity={0.8}>
                  <Text style={styles.resetBtnText}>Reset</Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity style={styles.applyBtn} onPress={handleApply} activeOpacity={0.85}>
                <Ionicons name="sparkles-outline" size={16} color="#FFFFFF" />
                <Text style={styles.applyBtnText}>Apply AI Personalization</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 48, 64, 0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 48, 64, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F3040',
  },
  closeBtn: {
    padding: 6,
  },
  subTitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 16,
  },
  inputWrapper: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 16,
  },
  textInput: {
    fontSize: 14,
    color: '#0F3040',
    minHeight: 80,
    lineHeight: 20,
  },
  presetsLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 10,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 48, 64, 0.06)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F3040',
    maxWidth: 220,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resetBtn: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
  },
  resetBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  applyBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F3040',
    paddingVertical: 14,
    borderRadius: 24,
    gap: 8,
  },
  applyBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
