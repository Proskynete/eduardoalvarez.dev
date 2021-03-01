export const calculateReadingTime = (text: string): number => {
	const _wordsPerMinute = 240;
	const _textLength: number = text.split(' ').length;

	if (_textLength < 0) return 0;
	return Math.ceil(_textLength / _wordsPerMinute);
};
