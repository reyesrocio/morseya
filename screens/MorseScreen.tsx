
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

const C = {
  fondo: '#101827',
  panel: '#1D293B',
  turquesa: '#35D6C1',
  blanco: '#F8FAFC',
  gris: '#CBD5E1',
  boton: '#103E43',
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
    if (senal && morseATexto(senal) === '?') {
      setEstado('Corrige la última señal');
      return;
    }

    const nuevas = senal
      ? [...letras, senal]
      : letras;

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

      Speech.speak(mensaje.trim(), {
        language: 'es-PE',
        rate: 0.9,

        onStart: () => setHablando(true),
        onDone: () => setHablando(false),
        onStopped: () => setHablando(false),

        onError: () => {
          setHablando(false);
          setEstado('No se pudo reproducir');
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
      {/* MENSAJE */}
      <View style={styles.panel}>
        <Text style={styles.etiqueta}>
          MENSAJE
        </Text>

        <Text
          style={styles.mensaje}
          accessibilityLiveRegion="polite"
        >
          {mensaje || '...'}
        </Text>

        <View style={styles.divisor} />

        <Text style={styles.etiqueta}>
          MORSE
        </Text>

        <Text style={styles.codigo}>
          {codigo || '· —'}
        </Text>
      </View>

      {/* CONTROLES */}
      <View style={styles.teclado}>
        <View style={styles.filaPrincipal}>

          <Pressable
            onPress={() => agregar('.')}
            accessibilityRole="button"
            accessibilityLabel="Punto"
            style={({ pressed }) => [
              styles.botonPrincipal,
              pressed && styles.presionado,
            ]}
          >
            <Text style={styles.simbolo}>●</Text>
            <Text style={styles.textoPrincipal}>
              Punto
            </Text>
          </Pressable>

          <Pressable
            onPress={() => agregar('-')}
            accessibilityRole="button"
            accessibilityLabel="Raya"
            style={({ pressed }) => [
              styles.botonPrincipal,
              pressed && styles.presionado,
            ]}
          >
            <Text style={styles.simbolo}>━</Text>
            <Text style={styles.textoPrincipal}>
              Raya
            </Text>
          </Pressable>
        </View>

        <View style={styles.filaSecundaria}>

          <Pressable
            style={styles.botonSecundario}
            onPress={confirmarLetra}
            accessibilityRole="button"
            accessibilityLabel="Confirmar letra"
          >
            <Text style={styles.textoSecundario}>
              Letra ↵
            </Text>
          </Pressable>

          <Pressable
            style={styles.botonSecundario}
            onPress={separarPalabra}
            accessibilityRole="button"
            accessibilityLabel="Separar palabra"
          >
            <Text style={styles.textoSecundario}>
              Espacio
            </Text>
          </Pressable>

          <Pressable
            style={styles.botonSecundario}
            onPress={borrar}
            accessibilityRole="button"
            accessibilityLabel="Borrar última señal o letra"
          >
            <Text style={styles.textoSecundario}>
              ⌫
            </Text>
          </Pressable>
        </View>

        {/* VOZ */}
        <Pressable
          onPress={hablando ? detener : reproducir}
          accessibilityRole="button"
          accessibilityLabel={
            hablando
              ? 'Detener voz'
              : 'Hablar mensaje'
          }
          style={({ pressed }) => [
            styles.botonVoz,
            pressed && { opacity: 0.85 },
          ]}
        >
          <Text style={styles.textoVoz}>
            {hablando
              ? '■ Detener'
              : '▶ Hablar'}
          </Text>
        </Pressable>

        <Pressable
          onPress={limpiar}
          accessibilityRole="button"
          accessibilityLabel="Limpiar mensaje"
          style={styles.limpiar}
        >
          <Text style={styles.textoLimpiar}>
            Limpiar
          </Text>
        </Pressable>
      </View>

      <Text
        style={styles.estado}
        accessibilityRole="alert"
      >
        {estado}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: C.fondo,
  },

  contenido: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },

  panel: {
    backgroundColor: C.panel,
    borderRadius: 22,
    padding: 22,
    minHeight: 185,
  },

  etiqueta: {
    color: C.gris,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
  },

  mensaje: {
    color: C.blanco,
    fontSize: 34,
    fontWeight: '800',
    marginTop: 14,
    marginBottom: 18,
  },

  divisor: {
    height: 1,
    backgroundColor: '#415064',
    marginBottom: 16,
  },

  codigo: {
    color: C.turquesa,
    fontSize: 22,
    marginTop: 10,
    fontWeight: '600',
    lineHeight: 32,
  },

  teclado: {
    marginTop: 24,
  },

  filaPrincipal: {
    flexDirection: 'row',
    gap: 12,
  },

  botonPrincipal: {
    flex: 1,
    minHeight: 135,
    borderRadius: 22,
    backgroundColor: C.boton,
    borderWidth: 2,
    borderColor: C.turquesa,
    alignItems: 'center',
    justifyContent: 'center',
  },

  presionado: {
    backgroundColor: '#17615F',
    transform: [{ scale: 0.97 }],
  },

  simbolo: {
    color: C.turquesa,
    fontSize: 48,
    fontWeight: '800',
  },

  textoPrincipal: {
    color: C.blanco,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },

  filaSecundaria: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },

  botonSecundario: {
    flex: 1,
    minHeight: 58,
    backgroundColor: C.panel,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },

  textoSecundario: {
    color: C.blanco,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },

  botonVoz: {
    backgroundColor: C.turquesa,
    minHeight: 66,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },

  textoVoz: {
    color: C.fondo,
    fontSize: 21,
    fontWeight: '800',
  },

  limpiar: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    marginTop: 8,
  },

  textoLimpiar: {
    color: C.gris,
    fontSize: 16,
  },

  estado: {
    color: C.turquesa,
    fontSize: 14,
    textAlign: 'center',
    minHeight: 20,
    marginTop: 8,
  },
});
