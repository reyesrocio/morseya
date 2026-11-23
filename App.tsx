
import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import HomeScreen from './screens/HomeScreen';
import MorseScreen from './screens/MorseScreen';
import VibrationScreen from './screens/VibrationScreen';

type Pantalla = 'inicio' | 'morse' | 'voz';

export default function App() {
  const [pantalla, setPantalla] = useState<Pantalla>('inicio');

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.app}>
        <StatusBar barStyle="light-content" />

        {pantalla === 'inicio' ? (
          <HomeScreen
            onMorse={() => setPantalla('morse')}
            onVoice={() => setPantalla('voz')}
          />
        ) : (
          <View style={styles.contenedor}>
            <View style={styles.cabecera}>
              <Pressable
                onPress={() => setPantalla('inicio')}
                accessibilityRole="button"
                accessibilityLabel="Volver al inicio"
                style={styles.volver}
              >
                <Text style={styles.flecha}>‹</Text>
              </Pressable>

              <Text style={styles.titulo}>
                {pantalla === 'morse'
                  ? 'Morse → Voz'
                  : 'Voz → Vibración'}
              </Text>

              <View style={styles.espaciador} />
            </View>

            <View style={styles.contenido}>
              {pantalla === 'morse' ? (
                <MorseScreen />
              ) : (
                <VibrationScreen />
              )}
            </View>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#101827',
  },
  contenedor: {
    flex: 1,
  },
  cabecera: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    backgroundColor: '#101827',
  },
  volver: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flecha: {
    color: '#35D6C1',
    fontSize: 42,
    lineHeight: 48,
  },
  titulo: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  espaciador: {
    width: 54,
  },
  contenido: {
    flex: 1,
  },
});
