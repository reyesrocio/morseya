
export type Pulso = {
  simbolo: '.' | '-';
  inicio: number;
  duracion: number;
};

export function crearPulsos(morse: string): Pulso[] {
  const pulsos: Pulso[] = [];
  let tiempo = 0;

  const palabras = morse.trim().split(/\s*\/\s*/);

  palabras.forEach((palabra, p) => {
    const letras = palabra.split(/\s+/).filter(Boolean);

    letras.forEach((letra, l) => {
      [...letra].forEach((simbolo, s) => {
        if (simbolo !== '.' && simbolo !== '-') return;

        const duracion = simbolo === '.' ? 150 : 450;

        pulsos.push({
          simbolo,
          inicio: tiempo,
          duracion,
        });

        tiempo += duracion;

        // Pausa entre señales de una letra
        if (s < letra.length - 1) tiempo += 150;
      });

      // Pausa entre letras
      if (l < letras.length - 1) tiempo += 450;
    });

    // Pausa entre palabras
    if (p < palabras.length - 1) tiempo += 1050;
  });

  return pulsos;
}

export function crearPatronAndroid(pulsos: Pulso[]): number[] {
  const patron: number[] = [];
  let finAnterior = 0;

  for (const pulso of pulsos) {
    patron.push(pulso.inicio - finAnterior);
    patron.push(pulso.duracion);
    finAnterior = pulso.inicio + pulso.duracion;
  }

  return patron;
}
