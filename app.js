const express = require('express');
const app = express();
const port = 3000;
const uploadRoutes = require('./routes/uploadRoutes');

// configure the body-parser middleware to accept larger payloads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/upload', uploadRoutes);

// just keep it
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});