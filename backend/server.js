const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api', require('./routes'));

app.get('/', (req, res) => {
    res.send('EasySplit API is running');
});

// Test DB Connection
app.get('/health', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.send('Database connection established successfully.');
    } catch (error) {
        res.status(500).send('Unable to connect to the database: ' + error.message);
    }
});

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
        await sequelize.authenticate();
        console.log('Database connected!');
    } catch (e) {
        console.error('Unable to connect to the database:', e);
    }
});
