const randomText = (strings) => {
	const string = strings.map((_string) => _string.text);
	return string[Math.floor(Math.random() * strings.length)];
};

export default randomText;
