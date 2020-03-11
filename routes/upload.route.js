const { Router } = require('express');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// const { check } = require('express-validator');
const uploadController = require('../controllers/upload.controller');

const router = Router();

router.get('/', uploadController.render);

router.get('/download/:fileID', uploadController.download);

router.post('/upload', upload.single('FILE'), uploadController.upload);


module.exports = router;
