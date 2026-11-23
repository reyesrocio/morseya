
import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StatusBar,
  StyleSheet,
} from 'react-native';

import HomeScreen from './screens/HomeScreen';
import MorseScreen from './screens/MorseScreen';
import VibrationScreen from './screens/VibrationScreen';

type Pantalla = 'inicio' | 'morse' | 'voz';

export default function App() {
  const [pantalla, setPantalla] = useState<Pantalla>('inicio');

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#101827"
      />

      {pantalla === 'inicio' ? (
        <HomeScreen
          onMorse={() => setPantalla('morse')}
          onVoice={() => setPantalla('voz')}
        />
      ) : (
        <View style={styles.container}>
          <Pressable
            onPress={() => setPantalla('inicio')}
            accessibilityRole="button"
            accessibilityLabel="Volver al inicio"
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Volver</Text>
          </Pressable>

          {pantalla === 'morse' ? (
            <MorseScreen />
          ) : (
            <View style={styles.placeholder}>
              <VibrationScreen />
              <Text style={styles.description}>
                Estamos preparando esta función.
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101827',
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  backText: {
    color: '#35D6C1',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: 'bold',
  },
  description: {
    color: '#CBD5E1',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
});
