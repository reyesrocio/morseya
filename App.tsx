
import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';

export default function App() {
  const [morse, setMorse] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MorseYa</Text>

      <Text style={styles.subtitle}>
        Comunicación que se siente 💜
      </Text>

      <Text style={styles.description}>
        Transforma cada señal en una oportunidad
        para comunicarte.
      </Text>

      <View style={styles.card}>
        <Text style={styles.heading}>
          Morse a voz
        </Text>

        <Text style={styles.result}>
          {morse || 'Introduce tu mensaje'}
        </Text>

        <View style={styles.buttons}>
          <Pressable
            style={styles.button}
            onPress={() => setMorse(morse + '.')}
          >
            <Text style={styles.buttonText}>● Punto</Text>
          </Pressable>

          <Pressable
            style={styles.button}
            onPress={() => setMorse(morse + '-')}
          >
            <Text style={styles.buttonText}>━ Raya</Text>
          </Pressable>
        </View>

        <Pressable onPress={() => setMorse('')}>
          <Text style={styles.clear}>Limpiar mensaje</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#6D28D9',
  },
  subtitle: {
    fontSize: 19,
    color: '#7C3AED',
    marginTop: 8,
  },
  description: {
    textAlign: 'center',
    marginVertical: 24,
    fontSize: 16,
    color: '#475569',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 20,
    width: '100%',
    maxWidth: 450,
  },
  heading: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  result: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 20,
    color: '#6D28D9',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#6D28D9',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  clear: {
    marginTop: 24,
    textAlign: 'center',
    color: '#6D28D9',
    fontWeight: 'bold',
  },
});
