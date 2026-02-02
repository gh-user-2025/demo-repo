const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { documents } = require('../data/store');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|txt|zip/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Get all documents for a project
router.get('/project/:projectId', auth, (req, res) => {
  try {
    const projectDocs = documents.filter(d => d.projectId === req.params.projectId);
    res.json(projectDocs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Upload document
router.post('/upload', auth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { projectId, description } = req.body;

    const newDocument = {
      id: uuidv4(),
      projectId,
      name: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimeType: req.file.mimetype,
      description: description || '',
      uploadedBy: req.userId,
      uploadedAt: new Date().toISOString()
    };

    documents.push(newDocument);
    res.status(201).json(newDocument);
  } catch (error) {
    res.status(500).json({ error: 'Error uploading document' });
  }
});

// Delete document
router.delete('/:id', auth, (req, res) => {
  try {
    const docIndex = documents.findIndex(d => d.id === req.params.id);
    if (docIndex === -1) {
      return res.status(404).json({ error: 'Document not found' });
    }

    documents.splice(docIndex, 1);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting document' });
  }
});

module.exports = router;
