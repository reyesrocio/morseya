
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import * as Speech from 'expo-speech';
import { morseATexto } from '../utils/morse';

const COLOR = {
  fondo: '#101827',
  superficie: '#1D293B',
  turquesa: '#35D6C1',
  blanco: '#F8FAFC',
  secundario: '#CBD5E1',
};

export default function MorseScreen() {
  const [letras, setLetras] = useState<string[]>([]);
  const [senal, setSenal] = useState('');
  const [hablando, setHablando] = useState(false);
  const [estado, setEstado] = useState('');

  const codigo = [...letras, senal]
    .filter(Boolean)
    .join(' ');

  const mensaje = morseATexto(codigo);

  useEffect(() => {
    return () => {
      void Speech.stop();
    };
  }, []);

  function agregar(simbolo: string) {
    if (senal.length >= 5) {
      setEstado('Señal demasiado larga');
      return;
    }
    setSenal(actual => actual + simbolo);
    setEstado('');
  }

  function confirmarLetra() {
    if (!senal) return;

    if (morseATexto(senal) === '?') {
      setEstado('Señal no reconocida');
      return;
    }

    setLetras(actual => [...actual, senal]);
    setSenal('');
    setEstado('');
  }

  function separarPalabra() {
    const nuevas = senal ? [...letras, senal] : letras;

    if (
      nuevas.length === 0 ||
      nuevas[nuevas.length - 1] === '/'
    ) return;

    setLetras([...nuevas, '/']);
    setSenal('');
    setEstado('');
  }

  function borrar() {
    if (senal) {
      setSenal(actual => actual.slice(0, -1));
    } else {
      setLetras(actual => actual.slice(0, -1));
    }
    setEstado('');
  }

  async function reproducir() {
    if (!mensaje.trim()) {
      setEstado('Introduce un mensaje');
      return;
    }

    if (mensaje.includes('?')) {
      setEstado('Corrige el código Morse');
      return;
    }

    try {
      await Speech.stop();
      Speech.speak(mensaje, {
        language: 'es-PE',
        rate: 0.9,
        onStart: () => setHablando(true),
        onDone: () => setHablando(false),
        onStopped: () => setHablando(false),
        onError: () => {
          setHablando(false);
          setEstado('No se pudo reproducir la voz');
        },
      });
    } catch {
      setHablando(false);
      setEstado('Voz no disponible');
    }
  }

  async function detener() {
    await Speech.stop();
    setHablando(false);
  }

  function limpiar() {
    void Speech.stop();
    setHablando(false);
    setLetras([]);
    setSenal('');
    setEstado('');
  }

  return (
    <ScrollView
      style={styles.pantalla}
      contentContainerStyle={styles.contenido}
    >
      <Text style={styles.encabezado}>Morse → Voz</Text>

      <View style={styles.mensajePanel}>
        <Text style={styles.etiqueta}>MENSAJE</Text>

        <Text
          style={styles.mensaje}
          accessibilityLiveRegion="polite"
        >
          {mensaje || '...'}
        </Text>

        <View style={styles.divisor} />

        <Text style={styles.etiqueta}>SEÑALES</Text>

        <Text style={styles.codigo}>
          {codigo || '· —'}
        </Text>
      </View>

      <View style={styles.teclado}>
        <View style={styles.filaPrincipal}>
          <Pressable
            style={({ pressed }) => [
              styles.botonPrincipal,
              pressed && styles.presionado,
            ]}
            onPress={() => agregar('.')}
            accessibilityRole="button"
            accessibilityLabel="Punto"
          >
            <Text style={styles.simbolo}>●</Text>
            <Text style={styles.textoPrincipal}>Punto</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.botonPrincipal,
              pressed && styles.presionado,
            ]}
            onPress={() => agregar('-')}
            accessibilityRole="button"
            accessibilityLabel="Raya"
          >
            <Text style={styles.simbolo}>━</Text>
            <Text style={styles.textoPrincipal}>Raya</Text>
          </Pressable>
        </View>

        <View style={styles.filaSecundaria}>
          <Pressable
            style={styles.botonSecundario}
            onPress={confirmarLetra}
            accessibilityRole="button"
            accessibilityLabel="Confirmar letra"
          >
            <Text style={styles.textoSecundario}>Letra ↵</Text>
          </Pressable>

          <Pressable
            style={styles.botonSecundario}
            onPress={separarPalabra}
            accessibilityRole="button"
            accessibilityLabel="Separar palabra"
          >
            <Text style={styles.textoSecundario}>Palabra /</Text>
          </Pressable>

          <Pressable
            style={styles.botonSecundario}
            onPress={borrar}
            accessibilityRole="button"
            accessibilityLabel="Borrar última señal"
          >
            <Text style={styles.textoSecundario}>⌫</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={hablando ? detener : reproducir}
          accessibilityRole="button"
          accessibilityLabel={
            hablando ? 'Detener voz' : 'Reproducir mensaje'
          }
          style={styles.botonVoz}
        >
          <Text style={styles.textoVoz}>
            {hablando
              ? '■ Detener voz'
              : '▶ Reproducir mensaje'}
          </Text>
        </Pressable>

        <Pressable
          onPress={limpiar}
          accessibilityRole="button"
          accessibilityLabel="Limpiar mensaje"
          style={styles.limpiar}
        >
          <Text style={styles.textoLimpiar}>Limpiar</Text>
        </Pressable>
      </View>

      <Text style={styles.estado} accessibilityRole="alert">
        {estado}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: COLOR.fondo,
  },
  contenido: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 30,
    justifyContent: 'space-between',
  },
  encabezado: {
    color: COLOR.blanco,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 22,
  },
  mensajePanel: {
    backgroundColor: COLOR.superficie,
    borderRadius: 24,
    padding: 24,
    minHeight: 190,
    justifyContent: 'center',
  },
  etiqueta: {
    color: COLOR.secundario,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.3,
  },
  mensaje: {
    color: COLOR.blanco,
    fontSize: 34,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 18,
  },
  divisor: {
    height: 1,
    backgroundColor: '#415064',
    marginBottom: 16,
  },
  codigo: {
    color: COLOR.turquesa,
    fontSize: 22,
    marginTop: 10,
    fontWeight: '600',
  },
  teclado: {
    marginTop: 30,
  },
  filaPrincipal: {
    flexDirection: 'row',
    gap: 14,
  },
  botonPrincipal: {
    flex: 1,
    minHeight: 145,
    borderRadius: 25,
    backgroundColor: '#103E43',
    borderWidth: 2,
    borderColor: COLOR.turquesa,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presionado: {
    backgroundColor: '#17615F',
    transform: [{ scale: 0.97 }],
  },
  simbolo: {
    fontSize: 48,
    fontWeight: '800',
    color: COLOR.turquesa,
  },
  textoPrincipal: {
    color: COLOR.blanco,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
  },
  filaSecundaria: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  botonSecundario: {
    flex: 1,
    minHeight: 62,
    backgroundColor: COLOR.superficie,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },
  textoSecundario: {
    color: COLOR.blanco,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  botonVoz: {
    minHeight: 66,
    backgroundColor: COLOR.turquesa,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 26,
  },
  textoVoz: {
    color: COLOR.fondo,
    fontSize: 19,
    fontWeight: '800',
  },
  limpiar: {
    alignItems: 'center',
    padding: 16,
  },
  textoLimpiar: {
    color: COLOR.secundario,
    fontSize: 16,
  },
  estado: {
    color: COLOR.turquesa,
    minHeight: 22,
    fontSize: 15,
    textAlign: 'center',
  },
});
