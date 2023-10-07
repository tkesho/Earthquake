const express = require('express');

const app = express();
app.use(express.static('public'));
const fs = require('fs');
const bodyParser = require('body-parser');
const port = 3000;


app.use(bodyParser.json());

// Serve the HTML file
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

// API endpoint to save earthquake data
app.post('/saveData', (req, res) => {
	const earthquakeData = req.body;

	// Write the data to data.json file
	fs.writeFile('data.json', JSON.stringify(earthquakeData, null, 4), (err) => {
		if (err) {
			console.error(err);
			res.status(500).send('Error saving data');
		} else {
			console.log('Data saved successfully');
			res.send('Data saved successfully');
		}
	});
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
