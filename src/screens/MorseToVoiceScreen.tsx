import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Vibration,
  Alert,
  Platform,
} from 'react-native';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { morseToText, morseToVibrationPattern } from '../utils/morseCode';

const DOT = '.';
const DASH = '-';
const LETTER_SEPARATOR = ' ';
const WORD_SEPARATOR = '/';

export default function MorseToVoiceScreen() {
  const [morseInput, setMorseInput] = useState('');
  const [decodedText, setDecodedText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const lastTapRef = useRef<number>(0);

  const addSymbol = async (symbol: string) => {
    await Haptics.impactAsync(
      symbol === DOT
        ? Haptics.ImpactFeedbackStyle.Light
        : Haptics.ImpactFeedbackStyle.Heavy
    );
    setMorseInput((prev) => prev + symbol);
    lastTapRef.current = Date.now();
  };

  const addLetterSpace = () => {
    setMorseInput((prev) => {
      if (prev.endsWith(LETTER_SEPARATOR) || prev.endsWith(WORD_SEPARATOR) || prev === '') return prev;
      return prev + LETTER_SEPARATOR;
    });
  };

  const addWordSpace = () => {
    setMorseInput((prev) => {
      if (prev.endsWith(WORD_SEPARATOR) || prev === '') return prev;
      const trimmed = prev.trimEnd();
      return trimmed + ' ' + WORD_SEPARATOR + ' ';
    });
  };

  const deleteLast = () => {
    setMorseInput((prev) => prev.slice(0, -1));
  };

  const clearAll = () => {
    setMorseInput('');
    setDecodedText('');
  };

  const translateAndSpeak = () => {
    if (!morseInput.trim()) {
      Alert.alert('Sin entrada', 'Ingresa código Morse primero.');
      return;
    }
    const text = morseToText(morseInput);
    setDecodedText(text);

    setIsSpeaking(true);
    Speech.speak(text, {
      language: 'es-PE',
      rate: 0.85,
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const stopSpeaking = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  // Vista previa en tiempo real
  const livePreview = morseToText(morseInput);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Título */}
      <Text style={styles.title}>✋ Morse → Voz</Text>
      <Text style={styles.subtitle}>Ingresa puntos y rayas para hablar</Text>

      {/* Display de entrada Morse */}
      <View style={styles.displayBox}>
        <Text style={styles.morseDisplay} numberOfLines={4}>
          {morseInput || '...'}
        </Text>
        <Text style={styles.previewText}>
          Vista previa: <Text style={styles.previewWord}>{livePreview}</Text>
        </Text>
      </View>

      {/* Botones principales */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.symbolBtn, styles.dotBtn]}
          onPress={() => addSymbol(DOT)}
          activeOpacity={0.7}
        >
          <Text style={styles.symbolBtnText}>•</Text>
          <Text style={styles.symbolBtnLabel}>PUNTO</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.symbolBtn, styles.dashBtn]}
          onPress={() => addSymbol(DASH)}
          activeOpacity={0.7}
        >
          <Text style={styles.symbolBtnText}>—</Text>
          <Text style={styles.symbolBtnLabel}>RAYA</Text>
        </TouchableOpacity>
      </View>

      {/* Controles secundarios */}
      <View style={styles.controlRow}>
        <TouchableOpacity style={styles.controlBtn} onPress={addLetterSpace}>
          <Text style={styles.controlBtnText}>Letra{'\n'}[espacio]</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtn} onPress={addWordSpace}>
          <Text style={styles.controlBtnText}>Palabra{'\n'}[/]</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlBtn, styles.deleteBtn]} onPress={deleteLast}>
          <Text style={styles.controlBtnText}>⌫{'\n'}Borrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlBtn, styles.clearBtn]} onPress={clearAll}>
          <Text style={styles.controlBtnText}>✕{'\n'}Limpiar</Text>
        </TouchableOpacity>
      </View>

      {/* Resultado decodificado */}
      {decodedText !== '' && (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Texto decodificado:</Text>
          <Text style={styles.resultText}>{decodedText}</Text>
        </View>
      )}

      {/* Botón de hablar */}
      <TouchableOpacity
        style={[styles.speakBtn, isSpeaking && styles.speakBtnActive]}
        onPress={isSpeaking ? stopSpeaking : translateAndSpeak}
        activeOpacity={0.8}
      >
        <Text style={styles.speakBtnText}>
          {isSpeaking ? '🔇 Detener' : '🔊 Traducir y Hablar'}
        </Text>
      </TouchableOpacity>

      {/* Referencia Morse rápida */}
      <View style={styles.refBox}>
        <Text style={styles.refTitle}>Referencia rápida</Text>
        <Text style={styles.refText}>A .-  B -...  C -.-.  D -..</Text>
        <Text style={styles.refText}>E .   F ..-.  G --.   H ....</Text>
        <Text style={styles.refText}>I ..  J .---  K -.-   L .-..</Text>
        <Text style={styles.refText}>M --  N -.    O ---   P .--.</Text>
        <Text style={styles.refText}>S ... T -     U ..-   Z --..</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#1a1a2e',
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e94560',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#a0a0b0',
    marginBottom: 20,
  },
  displayBox: {
    width: '100%',
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    minHeight: 90,
    borderWidth: 1,
    borderColor: '#e94560',
  },
  morseDisplay: {
    fontSize: 22,
    color: '#ffffff',
    letterSpacing: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  previewText: {
    fontSize: 13,
    color: '#a0a0b0',
    marginTop: 8,
  },
  previewWord: {
    color: '#4ecca3',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  symbolBtn: {
    width: 150,
    height: 150,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  dotBtn: {
    backgroundColor: '#4ecca3',
  },
  dashBtn: {
    backgroundColor: '#e94560',
  },
  symbolBtnText: {
    fontSize: 48,
    color: '#1a1a2e',
    fontWeight: 'bold',
  },
  symbolBtnLabel: {
    fontSize: 14,
    color: '#1a1a2e',
    fontWeight: '700',
    marginTop: 4,
  },
  controlRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  controlBtn: {
    backgroundColor: '#0f3460',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    minWidth: 72,
  },
  deleteBtn: {
    backgroundColor: '#533483',
  },
  clearBtn: {
    backgroundColor: '#7a2b2b',
  },
  controlBtnText: {
    color: '#ffffff',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  resultBox: {
    width: '100%',
    backgroundColor: '#0f3460',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  resultLabel: {
    color: '#a0a0b0',
    fontSize: 12,
    marginBottom: 4,
  },
  resultText: {
    color: '#4ecca3',
    fontSize: 20,
    fontWeight: 'bold',
  },
  speakBtn: {
    backgroundColor: '#e94560',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 40,
    marginBottom: 24,
    width: '100%',
    alignItems: 'center',
    elevation: 4,
  },
  speakBtnActive: {
    backgroundColor: '#7a2b2b',
  },
  speakBtnText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  refBox: {
    width: '100%',
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 14,
    marginBottom: 30,
  },
  refTitle: {
    color: '#e94560',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  refText: {
    color: '#a0a0b0',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 2,
  },
});
