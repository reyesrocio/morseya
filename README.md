# MorseYa

### Comunicación que se siente.

HackODS 2026 | Universidad Autónoma del Perú | ODS 10

MorseYa es un prototipo temporal de aplicación móvil de comunicación asistiva desarrollado para Android. Su propósito es explorar alternativas de comunicación mediante código Morse, voz sintetizada y vibraciones.

## El problema

Las personas con dificultades para comunicarse mediante el habla, la audición o la visión pueden encontrar barreras al utilizar herramientas convencionales y simples.

MorseYa busca ampliar las posibilidades de comunicación para personas que puedan utilizar sistemas de señales Morse y táctiles asi como de voz.

## Nuestra solución

MorseYa propone dos modalidades complementarias:

### 1. Voz → Vibración

Está diseñado para transformar mensajes hablados en señales táctiles y vibraciones.

Actualmente, el prototipo permite el uso del microfono del mismo teclado, convertirlo a código Morse y reproducirlo mediante vibraciones cortas y largas en Android.

Flujo implementado: Texto → Morse → Vibración.

El reconocimiento directo mediante micrófono se encuentra pendiente de integración por eso optamos por usar el microfono ya integrado en el teclado de cada dispositivo android.

## Tecnologías utilizadas

| Tecnología | Función |
|---|---|
| React Native | Desarrollo de la aplicación móvil |
| Expo SDK 58 | Entorno de desarrollo |
| TypeScript | Programación y tipado |
| expo-speech | Síntesis de voz |
| React Native Vibration API | Patrones de vibración |
| expo-speech-recognition | Biblioteca instalada; integración pendiente |
| Git y GitHub | Control de versiones y colaboración |
| EAS Build | Compilación para Android |

## Funcionalidades implementadas

- Reproducción de mensajes mediante voz.
- Conversión de texto a Morse.
- Vibraciones cortas y largas.
- Corrección y limpieza de mensajes.
- Controles para detener la reproducción.
- Interfaz móvil con alto contraste y simple de usar y observar.

## Estado del proyecto

Prototipo funcional en desarrollo.

Las modalidades voz a morse y texto a vibración también morse han sido probadas en un dispositivo Android.

Pendiente:
- Integrar reconocimiento de voz mediante micrófono de la misma app.
- Verificar la compilación APK independiente.
- Realizar pruebas de accesibilidad y usabilidad con usuarios destinatarios.

## Instalación para desarrollo

Requisitos: Node.js, npm y un dispositivo Android compatible.

Clonar el repositorio:

bash
git clone https://github.com/reyesrocio/morseya.git
cd morseya


Instalar dependencias:

bash
npm install


Iniciar Expo:

bash
npx expo start


Abrir el proyecto en Expo Go para probar las funciones compatibles. El reconocimiento de voz nativo requiere una compilación Android que incluya el módulo correspondiente.

## Demo funcional — MorseYa

¡Prueba MorseYa directamente en tu dispositivo Android!

El prototipo está disponible como una aplicación APK instalable, compilada mediante Expo EAS Build.

**[🚀 Descargar e instalar MorseYa para Android](https://expo.dev/accounts/rocioandreas-team/projects/morseya/builds/1c71388f-34b3-495d-b841-c4fb81505735)**

### Funcionalidades disponibles

- Código Morse → Texto → Voz.
- Texto → Código Morse → Vibración.
- Interfaz táctil accesible.
- Aplicación Android independiente de Expo Go.

**Estado:** MVP funcional — HackODS 2026.

*Nota: La instalación requiere un dispositivo Android compatible. El reconocimiento directo de voz mediante micrófono sigue en desarrollo.*

## Impacto social

MorseYa se relaciona con el Objetivo de Desarrollo Sostenible 10: Reducción de las desigualdades.

La propuesta busca ampliar las alternativas de comunicación mediante tecnologías accesibles desde dispositivos móviles.

No pretende reemplazar otros sistemas de comunicación asistiva. Su utilidad deberá validarse con las personas destinatarias.

---

MorseYa — Comunicación que se siente.

Proyecto desarrollado para HackODS 2026.
