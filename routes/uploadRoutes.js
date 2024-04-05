const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

router.post('/sessions', uploadController.createSession);
router.post('/sessions/:sessionId', uploadController.handleBatchUpload);
router.post('/sessions/:sessionId/finish', uploadController.finishBatchUpload);

module.exports = router;