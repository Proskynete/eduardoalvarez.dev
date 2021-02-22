export const prettyReadingTime = (readingTime: number): string => {
	let textResponse: string;

	if (readingTime < 1) {
		textResponse = 'Menos de un minuto';
	} else if (readingTime === 1) {
		textResponse = 'Lectura de ~1 minuto';
	} else {
		textResponse = `Lectura de ~${readingTime} minutos`;
	}

	return textResponse;
};
