// ============================================================
//  Diccionario Morse - Encode & Decode
// ============================================================

export const MORSE_CODE: Record<string, string> = {
  A: '.-',    B: '-...',  C: '-.-.',  D: '-..',
  E: '.',     F: '..-.',  G: '--.',   H: '....',
  I: '..',    J: '.---',  K: '-.-',   L: '.-..',
  M: '--',    N: '-.',    O: '---',   P: '.--.',
  Q: '--.-',  R: '.-.',   S: '...',   T: '-',
  U: '..-',   V: '...-',  W: '.--',   X: '-..-',
  Y: '-.--',  Z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..',
  '!': '-.-.--', ' ': '/',
};

// Mapa inverso: morse → letra
const REVERSE_MORSE: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_CODE).map(([k, v]) => [v, k])
);

/** Convierte texto a código Morse (ej: "HOLA" → ".... --- .-.. .-") */
export function textToMorse(text: string): string {
  return text
    .toUpperCase()
    .split('')
    .map((char) => MORSE_CODE[char] ?? '')
    .filter(Boolean)
    .join(' ');
}

/** Convierte código Morse a texto (ej: ".... ---" → "HO") */
export function morseToText(morse: string): string {
  return morse
    .trim()
    .split(' ')
    .map((code) => {
      if (code === '/') return ' ';
      return REVERSE_MORSE[code] ?? '?';
    })
    .join('');
}

/** Genera el patrón de vibración para un string Morse
 *  Punto = 100ms ON, 100ms OFF
 *  Raya  = 300ms ON, 100ms OFF
 *  Espacio entre letras = 300ms OFF adicionales
 */
export function morseToVibrationPattern(morse: string): number[] {
  const DOT_ON = 100;
  const DASH_ON = 300;
  const SYMBOL_GAP = 100;
  const LETTER_GAP = 300;
  const WORD_GAP = 700;

  const pattern: number[] = [0]; // empieza con 0ms de silencio

  morse.split(' ').forEach((code, wordIdx, arr) => {
    if (code === '/') {
      // Espacio entre palabras
      pattern.push(WORD_GAP);
      return;
    }

    code.split('').forEach((symbol, symIdx) => {
      pattern.push(symbol === '.' ? DOT_ON : DASH_ON);
      if (symIdx < code.length - 1) pattern.push(SYMBOL_GAP);
    });

    if (wordIdx < arr.length - 1 && arr[wordIdx + 1] !== '/') {
      pattern.push(LETTER_GAP);
    }
  });

  return pattern;
}
