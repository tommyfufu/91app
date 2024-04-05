const express = require('express');
const app = express();
const port = 3000;
const uploadRoutes = require('./routes/uploadRoutes');

app.use(express.json()); // Middleware to parse JSON bodies
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

// const sessions = {};

// app.post('/api/upload/sessions', (req, res) => {
//     const sessionId = generateUniqueId();
//     const { totalRecord } = req.body;

//     sessions[sessionId] = { totalRecord, recordsReceived: 0 };

//     res.json({ sessionId });
// });

// function generateUniqueId() {
//     return uuidv4();
// }