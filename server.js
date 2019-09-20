const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

app.get('/', (req, res) => res.send('AIP Running'));

const PORT = process.env.PORT || 5000;
// process.env.PORT will listen for an environment variable called PORT when depoyed to Heroku
// Locally it will run on PORT 5000

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
