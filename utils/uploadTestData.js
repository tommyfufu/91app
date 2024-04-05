const axios = require('axios');
const readline = require('readline');

const baseURL = 'http://localhost:3000/api/upload';
const recordsPerBatch = 1000;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function askQuestion(query) {
    return new Promise(resolve => {
        rl.question(query, (answer) => {
            resolve(answer);
        });
    });
}

async function createSession(totalRecords) {
    const response = await axios.post(`${baseURL}/sessions`, {
        totalRecord: totalRecords,
    });
    return response.data.sessionId;
}

async function uploadBatch(sessionId, seqNum, data) {
    await axios.post(`${baseURL}/sessions/${sessionId}`, {
        seqNum,
        data,
    });
}

async function uploadData(sessionId, totalRecords) {
    const batches = Math.ceil(totalRecords / recordsPerBatch);

    for (let i = 0; i < batches; i++) {
        let data = [];
        for (let j = 0; j < recordsPerBatch; j++) {
            data.push({ keyA: `valueA_${i * recordsPerBatch + j}`, keyB: i * recordsPerBatch + j });
        }
        console.log(`Uploading batch ${i + 1}/${batches}`);
        await uploadBatch(sessionId, i, data);
    }
}

async function finishUpload(sessionId) {
    const response = await axios.post(`${baseURL}/sessions/${sessionId}/finish`);
    return response.data;
}

async function main() {
    let totalRecords = 90000; // default value in doc

    try {
        const input = await askQuestion(`How many records do you want to upload? (default: 90000): `);
        totalRecords = input || totalRecords; // Use the provided input or default to 90000
        console.log(`${totalRecords} records will be uploaded.`);
        rl.close();

        const sessionId = await createSession(totalRecords);
        console.log(`Created session: ${sessionId}`);

        await uploadData(sessionId, totalRecords);
        console.log('Data upload completed.');

        const res = await finishUpload(sessionId);
        console.log(`Data validated ${res.validationResult.toLowerCase()}.`);       
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}

main();
