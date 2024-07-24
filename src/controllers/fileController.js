const FileService = require('../services/fileService');
const path = require('path');
const fs = require('fs');

class FileController {
  constructor() {
    this.fileService = new FileService();
  }

  async upload(req, res) {
    try {
      const file = req.file;
      const newFile = await this.fileService.uploadFile(file);
      res.status(201).json(newFile);
    } catch (err) {
      res.status(500).send('Error uploading file');
    }
  }

  async list(req, res) {
    const { page = 1, list_size = 10 } = req.query;
    try {
      const files = await this.fileService.listFiles(page, list_size);
      res.status(200).json(files);
    } catch (err) {
      res.status(500).send('Error listing files');
    }
  }

  async getFile(req, res) {
    const { id } = req.params;
    try {
      const file = await this.fileService.getFileById(id);
      if (file) {
        res.status(200).json(file);
      } else {
        res.status(404).send('File not found');
      }
    } catch (err) {
      res.status(500).send('Error getting file');
    }
  }

  async remove(req, res) {
    const { id } = req.params;
    try {
      await this.fileService.deleteFile(id);
      res.status(204).json({ message: 'File deleted successfully' }); 
    } catch (err) {
      if (err.message === 'File not found') {
        res.status(404).send('File not found');
      } else {
        res.status(500).send('Error deleting file');
      }
    }
  };

  async download(req, res) {
    const { id } = req.params;
    try {
      const file = await this.fileService.getFileById(id);
      if (!file) {
        return res.status(404).send('File not found');
      }
  
      const filePath = path.join(__dirname, '../../uploads/', file.id + file.extension);
      console.log(`File path: ${filePath}`);
      console.log(`File name: ${file.name}`);
      console.log(`Original name: ${file.originalName || file.name}`);
  
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.error(`File does not exist at path: ${filePath}`);
        return res.status(404).send('File not found');
      }
  
      // Send file for download
      res.status(200).download(filePath, file.name || file.name, (err) => {
        if (err) {
          console.error(`Error sending file: ${err.message}`);
          res.status(500).send('Error downloading file');
        }
      });
    } catch (err) {
      console.error(`Error in download method: ${err.message}`);
      res.status(500).send('Error downloading file');
    }
  }
  
}

module.exports = FileController;
