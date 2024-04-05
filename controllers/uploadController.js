const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const sessions = {};
const util = require('util');
const stream = require('stream');
const finished = util.promisify(stream.finished);

async function mergeFiles(sessionId, outputFile) {
    const uploadDataDir = path.join(__dirname, '..', 'upload-data', sessionId);
    const finalOutputPath = path.join(__dirname, '..', outputFile);


    await fs.promises.mkdir(uploadDataDir, { recursive: true });

    let writeStream = fs.createWriteStream(finalOutputPath);

    const files = fs.readdirSync(uploadDataDir).sort();
    for (const file of files) {
        const filePath = path.join(uploadDataDir, file);
        const readStream = fs.createReadStream(filePath);

        readStream.pipe(writeStream, { end: false });
        await finished(readStream);

        writeStream.write('\n');
    }

    writeStream.end();
}

exports.createSession = (req, res) => {
    const sessionId = uuidv4();
    const { totalRecord } = req.body;
    if(parseInt(totalRecord) <= 0){
        console.log("sessions.totalRecord ", totalRecord, "should be greater than 0");
        return res.status(400).send('number of records should be greater than 0');
    }
    sessions[sessionId] = { totalRecord, recordsReceived: 0 };
    console.log("create Session: ", sessionId);
    res.json({ sessionId });
};

exports.handleBatchUpload = (req, res) => {
    const sessionId = req.params.sessionId;
    const { seqNum, data } = req.body;

    if (!sessions[sessionId]) {
        console.log('Auth failed: Session not found');
        return res.status(404).send('Auth failed: Session not found');
    }


    const dirPath = path.join(__dirname, '..', 'upload-data', sessionId);
    const filename = path.join(dirPath, `_batch_${seqNum}.json`);

    // Ensure the directory exists
    fs.mkdir(dirPath, { recursive: true }, (err) => {
        if (err) {
            console.error('Error creating directory:', err);
            return res.status(500).send('Error creating directory');
        }

        // Directory exists, now write the file
        fs.writeFile(filename, JSON.stringify(data), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(504).send('Error writing file');
            }

            sessions[sessionId].recordsReceived += data.length;
            res.status(204).send();
        });
    });

};

exports.finishBatchUpload = async (req, res) => {
    const sessionId = req.params.sessionId;

    if (!sessions[sessionId]) {
        return res.status(404).send('Session not found');
    }

    const expectedRecords = sessions[sessionId].totalRecord;
    const receivedRecords = sessions[sessionId].recordsReceived;

    console.log('expectedRecords: ', expectedRecords);
    console.log('receivedRecords: ', receivedRecords);

    const outputFile = `upload-data/${sessionId}_final.json`;
    try {
        await mergeFiles(sessionId, outputFile);
        const validationResult = parseInt(expectedRecords) === receivedRecords ? 'Success' : 'Failed';
        console.log('receivedRecords: ', validationResult);
        res.json({ sessionId, validationResult });
    } catch (error) {
        console.error('Error merging files:', error);
        res.status(500).send('Error merging files');
    }
};
