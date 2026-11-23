
const diccionario: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..',
  E: '.', F: '..-.', G: '--.', H: '....',
  I: '..', J: '.---', K: '-.-', L: '.-..',
  M: '--', N: '-.', O: '---', P: '.--.',
  Q: '--.-', R: '.-.', S: '...', T: '-',
  U: '..-', V: '...-', W: '.--', X: '-..-',
  Y: '-.--', Z: '--..',
  0: '-----', 1: '.----', 2: '..---',
  3: '...--', 4: '....-', 5: '.....',
  6: '-....', 7: '--...', 8: '---..',
  9: '----.'
};

export function textoAMorse(texto: string): string {
  return texto
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(' ')
    .map(palabra =>
      [...palabra].map(letra => diccionario[letra] || '').filter(Boolean).join(' ')
    )
    .join(' / ');
}

export function morseATexto(morse: string): string {
  const inverso = Object.fromEntries(
    Object.entries(diccionario).map(([letra, codigo]) => [codigo, letra])
  );

  if (!morse.trim()) return '';

  return morse.trim().split(/\s*\/\s*/).map(palabra =>
    palabra.trim().split(/\s+/).map(codigo =>
      inverso[codigo] || '?'
    ).join('')
  ).join(' ');
}
