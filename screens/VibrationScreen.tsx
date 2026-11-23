
import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
  Vibration,
} from 'react-native';

import { textoAMorse } from '../utils/morse';
import {
  crearPulsos,
  crearPatronAndroid,
} from '../utils/vibracion';

export default function VibrationScreen() {
  const [texto, setTexto] = useState('HOLA');
  const [activo, setActivo] = useState('');
  const [reproduciendo, setReproduciendo] = useState(false);
  const [estado, setEstado] = useState('');

  const temporizadores = useRef<ReturnType<typeof setTimeout>[]>([]);

  const codigo = textoAMorse(texto);

  function detener() {
    temporizadores.current.forEach(clearTimeout);
    temporizadores.current = [];
    Vibration.cancel();
    setActivo('');
    setReproduciendo(false);
  }

  useEffect(() => {
    return () => {
      temporizadores.current.forEach(clearTimeout);
      Vibration.cancel();
    };
  }, []);

  function reproducir() {
    detener();

    const pulsos = crearPulsos(codigo);

    if (!pulsos.length) {
      setEstado('Escribe un mensaje válido');
      return;
    }

    if (pulsos.length > 55) {
      setEstado('Usa un mensaje más corto para esta prueba');
      return;
    }

    setReproduciendo(true);
    setEstado(
      Platform.OS === 'android'
        ? 'Enviando patrón de vibración'
        : 'Reproducción visual'
    );

    if (Platform.OS === 'android') {
      try {
        Vibration.vibrate(crearPatronAndroid(pulsos));
      } catch {
        setEstado('Solo reproducción visual');
      }
    }

    pulsos.forEach(pulso => {
      temporizadores.current.push(
        setTimeout(() => {
          setActivo(pulso.simbolo);
        }, pulso.inicio)
      );

      temporizadores.current.push(
        setTimeout(() => {
          setActivo('');
        }, pulso.inicio + pulso.duracion)
      );
    });

    const ultimo = pulsos[pulsos.length - 1];
    const fin = ultimo.inicio + ultimo.duracion;

    temporizadores.current.push(
      setTimeout(() => {
        setReproduciendo(false);
        setActivo('');
        setEstado('Secuencia finalizada');
      }, fin + 100)
    );
  }

  return (
    <ScrollView
      style={styles.pantalla}
      contentContainerStyle={styles.contenido}
    >
      <Text style={styles.titulo}>Voz → Vibración</Text>

      <Text style={styles.info}>
        Entrada de texto para probar la vibración
      </Text>

      <View style={styles.tarjeta}>
        <Text style={styles.etiqueta}>MENSAJE</Text>

        <TextInput
          style={styles.entrada}
          value={texto}
          onChangeText={setTexto}
          placeholder="Escribe aquí"
          placeholderTextColor="#94A3B8"
          accessibilityLabel="Mensaje para convertir a Morse"
          maxLength={40}
          editable={!reproduciendo}
          autoCapitalize="characters"
        />

        <Text style={styles.etiqueta}>CÓDIGO MORSE</Text>

        <Text style={styles.codigo}>
          {codigo || '● ━'}
        </Text>
      </View>

      <View style={styles.centro}>
        <View
          style={[
            styles.pulso,
            activo !== '' && styles.pulsoActivo,
          ]}
        >
          <Text style={[
            styles.simbolo,
            activo !== '' && styles.simboloActivo,
          ]}>
            {activo === '.' ? '●' : activo === '-' ? '━' : '● ━'}
          </Text>
        </View>

        <Text style={styles.estado}>
          {activo === '.'
            ? 'PUNTO'
            : activo === '-'
            ? 'RAYA'
            : reproduciendo
            ? 'TRANSMITIENDO'
            : estado || 'LISTO'}
        </Text>
      </View>

      <Pressable
        style={styles.accion}
        onPress={reproduciendo ? detener : reproducir}
        accessibilityRole="button"
        accessibilityLabel={
          reproduciendo
            ? 'Detener vibración'
            : 'Reproducir vibración'
        }
      >
        <Text style={styles.accionTexto}>
          {reproduciendo
            ? '■ Detener'
            : '▶ Reproducir vibración'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: '#101827',
  },
  contenido: {
    flexGrow: 1,
    padding: 22,
    paddingBottom: 35,
  },
  titulo: {
    fontSize: 27,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  info: {
    color: '#CBD5E1',
    fontSize: 14,
    marginBottom: 22,
  },
  tarjeta: {
    backgroundColor: '#1D293B',
    padding: 22,
    borderRadius: 22,
  },
  etiqueta: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  entrada: {
    backgroundColor: '#101827',
    color: '#F8FAFC',
    borderRadius: 12,
    padding: 15,
    fontSize: 21,
    marginBottom: 22,
  },
  codigo: {
    color: '#35D6C1',
    fontSize: 22,
    lineHeight: 34,
  },
  centro: {
    flex: 1,
    minHeight: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulso: {
    width: 165,
    height: 165,
    borderRadius: 83,
    backgroundColor: '#1D293B',
    borderColor: '#35D6C1',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulsoActivo: {
    backgroundColor: '#35D6C1',
  },
  simbolo: {
    color: '#35D6C1',
    fontSize: 38,
    fontWeight: 'bold',
  },
  simboloActivo: {
    color: '#101827',
  },
  estado: {
    color: '#CBD5E1',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 22,
  },
  accion: {
    backgroundColor: '#35D6C1',
    borderRadius: 18,
    minHeight: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accionTexto: {
    color: '#101827',
    fontSize: 19,
    fontWeight: '800',
  },
});
