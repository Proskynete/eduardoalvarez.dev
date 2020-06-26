const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, './build')));

app.get('*', (_, res) => {
	res.sendFile(path.join(__dirname, './build', 'index.html'));
});

app.listen(port, () => {
	console.log(`React aplication is running on port: ${port}`);
});
