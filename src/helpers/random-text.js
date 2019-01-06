const randomText = (strings) => {
    const string = strings.map(_string => _string.text);
    return string[Math.floor(Math.random() * 3)];
};

export default randomText;
