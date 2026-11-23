import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

type Props = {
  onMorse: () => void;
  onVoice: () => void;
};

export default function HomeScreen({ onMorse, onVoice }: Props) {
  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>
            Morse<Text style={styles.accent}>Ya</Text>
          </Text>
          <Text style={styles.question}>¿Cómo quieres comunicarte?</Text>
        </View>

        <View style={styles.center}>
          <Pressable
            onPress={onMorse}
            accessibilityRole="button"
            accessibilityLabel="Morse a voz"
            accessibilityHint="Abrir comunicación de Morse a voz"
            style={({ pressed }) => [
              styles.node,
              pressed && styles.nodePressed,
            ]}
          >
            <Text style={styles.nodeSymbol}>● ━</Text>
          </Pressable>

          <View style={styles.connector}>
            <View style={styles.connectorLine} />
            <View style={styles.connectorDot} />
            <View style={styles.connectorLine} />
          </View>

          <Pressable
            onPress={onVoice}
            accessibilityRole="button"
            accessibilityLabel="Voz a vibración"
            accessibilityHint="Abrir comunicación de voz a vibración"
            style={({ pressed }) => [
              styles.node,
              pressed && styles.nodePressed,
            ]}
          >
            <Text style={styles.nodeSymbol}>🎙</Text>
          </Pressable>
        </View>

        <View style={styles.labels}>
          <Text style={styles.label}>Morse a voz</Text>
          <Text style={styles.label}>Voz a vibración</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#101827',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 36,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 8,
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
  question: {
    marginTop: 18,
    fontSize: 28,
    lineHeight: 34,
    textAlign: 'center',
    color: '#F8FAFC',
    fontWeight: '700',
    maxWidth: 280,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  node: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#1D293B',
    borderWidth: 2,
    borderColor: '#35D6C1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  nodePressed: {
    backgroundColor: '#243447',
    transform: [{ scale: 0.98 }],
  },
  nodeSymbol: {
    color: '#35D6C1',
    fontSize: 40,
    fontWeight: '800',
  },
  connector: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
  },
  connectorLine: {
    width: 2,
    height: 28,
    backgroundColor: '#35D6C1',
    opacity: 0.8,
  },
  connectorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#35D6C1',
    marginVertical: 6,
  },
  labels: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  label: {
    color: '#CBD5E1',
    fontSize: 16,
    fontWeight: '600',
  },
});