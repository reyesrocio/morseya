import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';

type Props = {
  navigation: NavigationProp<any>;
};

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <View style={styles.container}>
        {/* Logo / Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🤝</Text>
          <Text style={styles.appName}>MorseBridge</Text>
          <Text style={styles.tagline}>Comunicación sin barreras</Text>
        </View>

        {/* Descripción breve */}
        <View style={styles.descBox}>
          <Text style={styles.descText}>
            Aplicación inclusiva para facilitar la comunicación entre personas
            con sordoceguera y el mundo.
          </Text>
        </View>

        {/* Opciones de modo */}
        <Text style={styles.chooseLabel}>Selecciona el modo:</Text>

        <TouchableOpacity
          style={[styles.modeBtn, styles.modeBtnMorse]}
          onPress={() => navigation.navigate('MorseToVoice')}
          activeOpacity={0.85}
        >
          <Text style={styles.modeIcon}>✋</Text>
          <View style={styles.modeBtnContent}>
            <Text style={styles.modeBtnTitle}>Morse → Voz</Text>
            <Text style={styles.modeBtnDesc}>
              Ingresa puntos y rayas con botones táctiles.{'\n'}
              La app traduce y habla en voz alta.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeBtn, styles.modeBtnVoice]}
          onPress={() => navigation.navigate('VoiceToMorse')}
          activeOpacity={0.85}
        >
          <Text style={styles.modeIcon}>🎙️</Text>
          <View style={styles.modeBtnContent}>
            <Text style={styles.modeBtnTitle}>Voz → Morse</Text>
            <Text style={styles.modeBtnDesc}>
              Habla al micrófono.{'\n'}
              La app vibra el mensaje en Morse.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footer}>
          MVP · Proyecto Innovador · Lima, Perú 🇵🇪
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logo: {
    fontSize: 72,
    marginBottom: 8,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 15,
    color: '#4ecca3',
    marginTop: 4,
    fontStyle: 'italic',
  },
  descBox: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 28,
    width: '100%',
  },
  descText: {
    color: '#a0a0b0',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  chooseLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginBottom: 14,
  },
  modeBtn: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    gap: 16,
  },
  modeBtnMorse: {
    backgroundColor: '#0f3460',
    borderLeftWidth: 5,
    borderLeftColor: '#4ecca3',
  },
  modeBtnVoice: {
    backgroundColor: '#0f3460',
    borderLeftWidth: 5,
    borderLeftColor: '#e94560',
  },
  modeIcon: {
    fontSize: 44,
  },
  modeBtnContent: {
    flex: 1,
  },
  modeBtnTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modeBtnDesc: {
    color: '#a0a0b0',
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    color: '#4a4a6a',
    fontSize: 12,
    marginTop: 24,
    textAlign: 'center',
  },
});
