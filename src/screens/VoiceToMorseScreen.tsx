import React, { useState, useEffect } from 'react';
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
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import { textToMorse, morseToVibrationPattern } from '../utils/morseCode';

export default function VoiceToMorseScreen() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [morseOutput, setMorseOutput] = useState('');
  const [isVibrating, setIsVibrating] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Solicitar permiso de micrófono al montar
  useEffect(() => {
    (async () => {
      const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      setPermissionGranted(result.granted);
    })();
  }, []);

  // Eventos del reconocimiento de voz
  useSpeechRecognitionEvent('result', (event) => {
    const text = event.results[0]?.transcript ?? '';
    setTranscript(text);
    if (event.isFinal) {
      const morse = textToMorse(text);
      setMorseOutput(morse);
      setIsListening(false);
    }
  });

  useSpeechRecognitionEvent('error', (event) => {
    console.error('Speech error:', event.error);
    setIsListening(false);
    Alert.alert('Error', 'No se pudo reconocer el audio. Intenta de nuevo.');
  });

  useSpeechRecognitionEvent('end', () => {
    setIsListening(false);
  });

  const startListening = async () => {
    if (!permissionGranted) {
      Alert.alert(
        'Permiso requerido',
        'Necesitamos acceso al micrófono para reconocer voz.'
      );
      return;
    }
    setTranscript('');
    setMorseOutput('');
    setIsListening(true);

    ExpoSpeechRecognitionModule.start({
      lang: 'es-PE',
      interimResults: true,
      continuous: false,
    });
  };

  const stopListening = () => {
    ExpoSpeechRecognitionModule.stop();
    setIsListening(false);
  };

  const vibrateMessage = () => {
    if (!morseOutput) {
      Alert.alert('Sin mensaje', 'Primero graba un mensaje de voz.');
      return;
    }

    const pattern = morseToVibrationPattern(morseOutput);

    if (Platform.OS === 'android') {
      Vibration.vibrate(pattern);
      setIsVibrating(true);
      // Calcular duración total para saber cuándo termina
      const totalMs = pattern.reduce((a, b) => a + b, 0);
      setTimeout(() => setIsVibrating(false), totalMs + 200);
    } else {
      // iOS: simulación con secuencia simple (limitación del sistema)
      Alert.alert(
        'iOS - Vibración limitada',
        'En iPhone la vibración personalizada está limitada. Se reproducirá una secuencia básica.',
        [{ text: 'OK', onPress: () => Vibration.vibrate([0, 200, 100, 400]) }]
      );
    }
  };

  const stopVibration = () => {
    Vibration.cancel();
    setIsVibrating(false);
  };

  const clearAll = () => {
    setTranscript('');
    setMorseOutput('');
    Vibration.cancel();
    setIsVibrating(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎙️ Voz → Morse</Text>
      <Text style={styles.subtitle}>Habla y el mensaje se convierte en vibraciones</Text>

      {/* Visualizador de estado */}
      <View style={[styles.statusBox, isListening && styles.statusBoxActive]}>
        {isListening ? (
          <>
            <Text style={styles.statusIcon}>🔴</Text>
            <Text style={styles.statusText}>Escuchando...</Text>
          </>
        ) : (
          <>
            <Text style={styles.statusIcon}>⚪</Text>
            <Text style={styles.statusText}>Listo para grabar</Text>
          </>
        )}
      </View>

      {/* Botón micrófono */}
      <TouchableOpacity
        style={[styles.micBtn, isListening && styles.micBtnActive]}
        onPress={isListening ? stopListening : startListening}
        activeOpacity={0.8}
      >
        <Text style={styles.micIcon}>{isListening ? '⏹' : '🎤'}</Text>
        <Text style={styles.micLabel}>
          {isListening ? 'Detener grabación' : 'Iniciar grabación'}
        </Text>
      </TouchableOpacity>

      {/* Transcripción */}
      {transcript !== '' && (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Texto reconocido:</Text>
          <Text style={styles.resultText}>{transcript}</Text>
        </View>
      )}

      {/* Morse generado */}
      {morseOutput !== '' && (
        <View style={styles.morseBox}>
          <Text style={styles.morseLabel}>Código Morse:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Text style={styles.morseText}>{morseOutput}</Text>
          </ScrollView>
        </View>
      )}

      {/* Botones de vibración */}
      {morseOutput !== '' && (
        <View style={styles.vibRow}>
          <TouchableOpacity
            style={[styles.vibBtn, isVibrating && styles.vibBtnActive]}
            onPress={isVibrating ? stopVibration : vibrateMessage}
            activeOpacity={0.8}
          >
            <Text style={styles.vibIcon}>📳</Text>
            <Text style={styles.vibLabel}>
              {isVibrating ? 'Detener vibración' : 'Enviar por vibración'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Instrucciones */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>¿Cómo funciona?</Text>
        <Text style={styles.infoText}>
          1️⃣ Pulsa el botón micrófono y habla claramente{'\n'}
          2️⃣ La app reconoce tu voz y la convierte a Morse{'\n'}
          3️⃣ Presiona "Enviar por vibración" para que la{'\n'}
          {'   '}persona con sordoceguera sienta el mensaje{'\n\n'}
          <Text style={styles.infoNote}>
            Vibración corta = Punto (·){'\n'}
            Vibración larga = Raya (—)
          </Text>
        </Text>
      </View>

      {/* Limpiar */}
      {(transcript || morseOutput) && (
        <TouchableOpacity style={styles.clearBtn} onPress={clearAll}>
          <Text style={styles.clearBtnText}>✕ Limpiar todo</Text>
        </TouchableOpacity>
      )}
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
    color: '#4ecca3',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#a0a0b0',
    marginBottom: 24,
    textAlign: 'center',
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#0f3460',
    gap: 10,
  },
  statusBoxActive: {
    borderColor: '#e94560',
  },
  statusIcon: {
    fontSize: 16,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  micBtn: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#4ecca3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    elevation: 8,
    shadowColor: '#4ecca3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  micBtnActive: {
    backgroundColor: '#e94560',
    shadowColor: '#e94560',
  },
  micIcon: {
    fontSize: 56,
  },
  micLabel: {
    color: '#1a1a2e',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 6,
    textAlign: 'center',
  },
  resultBox: {
    width: '100%',
    backgroundColor: '#0f3460',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  resultLabel: {
    color: '#a0a0b0',
    fontSize: 12,
    marginBottom: 4,
  },
  resultText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  morseBox: {
    width: '100%',
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4ecca3',
  },
  morseLabel: {
    color: '#a0a0b0',
    fontSize: 12,
    marginBottom: 6,
  },
  morseText: {
    color: '#4ecca3',
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 3,
  },
  vibRow: {
    width: '100%',
    marginBottom: 20,
  },
  vibBtn: {
    backgroundColor: '#533483',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    elevation: 4,
  },
  vibBtnActive: {
    backgroundColor: '#7a2b2b',
  },
  vibIcon: {
    fontSize: 24,
  },
  vibLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoTitle: {
    color: '#4ecca3',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    color: '#a0a0b0',
    fontSize: 13,
    lineHeight: 20,
  },
  infoNote: {
    color: '#ffffff',
    fontWeight: '600',
  },
  clearBtn: {
    marginBottom: 30,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#7a2b2b',
  },
  clearBtnText: {
    color: '#e94560',
    fontSize: 14,
  },
});
