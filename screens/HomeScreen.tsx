
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

type Props = {
  onMorse: () => void;
  onVoice: () => void;
};

export default function HomeScreen({ onMorse, onVoice }: Props) {
  const { width, height } = useWindowDimensions();

  const size = Math.max(
    130,
    Math.min(175, width * 0.48, (height - 180) / 2.5)
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>
          Morse<Text style={styles.accent}>Ya</Text>
        </Text>
      </View>

      <View style={styles.main}>
        <Pressable
          onPress={onMorse}
          accessibilityRole="button"
          accessibilityLabel="Morse a voz"
          accessibilityHint="Abrir comunicación mediante código Morse"
          style={({ pressed }) => [
            styles.circle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.morseSymbol}>● ━</Text>
        </Pressable>

        <Pressable
          onPress={onVoice}
          accessibilityRole="button"
          accessibilityLabel="Voz a vibración"
          accessibilityHint="Abrir comunicación mediante vibraciones"
          style={({ pressed }) => [
            styles.circle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.micSymbol}>🎙</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101827',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 24,
  },
  logo: {
    fontSize: 34,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -1,
  },
  accent: {
    color: '#35D6C1',
  },
  main: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
    paddingVertical: 20,
  },
  circle: {
    backgroundColor: '#1D293B',
    borderWidth: 2,
    borderColor: '#35D6C1',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  pressed: {
    backgroundColor: '#155A60',
    transform: [{ scale: 0.96 }],
  },
  morseSymbol: {
    color: '#35D6C1',
    fontSize: 40,
    fontWeight: '800',
  },
  micSymbol: {
    fontSize: 48,
  },
});
