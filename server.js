const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

app.get('/', (req, res) => res.send('AIP Running'));

// Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;
// process.env.PORT will listen for an environment variable called PORT when depoyed to Heroku
// Locally it will run on PORT 5000

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
