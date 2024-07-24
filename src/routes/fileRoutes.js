const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const FileController = require('../controllers/fileController');
const authenticateToken = require('../middleware/authMiddleware');

const fileController = new FileController();
 
//File size limit
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

// Allowed MIME types for images
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

// Memory storage for multer
const storage = multer.memoryStorage();

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true); 
  } else {
    cb(new Error('Invalid file type. Only images are allowed.'), false); 
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE 
  },
  fileFilter: fileFilter 
});

router.post('/upload', authenticateToken, upload.single('file'), (req, res) => fileController.upload(req, res));
router.get('/list', authenticateToken, (req, res) => fileController.list(req, res));
router.get('/:id', authenticateToken, (req, res) => fileController.getFile(req, res));
router.delete('/delete/:id', authenticateToken, (req, res) => fileController.remove(req, res));
router.get('/download/:id', authenticateToken, (req, res) => fileController.download(req, res)); 

module.exports = router;
