const { File } = require('../models');
const path = require('path');
const fs = require('fs');

class FileService {
  async uploadFile(file) {
    const { originalname, mimetype, size, buffer } = file;
    const ext = path.extname(originalname);
    const newFile = await File.create({
      name: originalname,
      extension: ext,
      mimeType: mimetype,
      size
    });

    const filePath = path.join(__dirname, '../../uploads/', newFile.id + ext);
    console.log(`Saving file to: ${filePath}`);

    fs.writeFileSync(filePath, buffer);    
    return newFile;
  }

  async listFiles(page, listSize) {
    const offset = (page - 1) * listSize;
    return File.findAndCountAll({ offset, limit: listSize });
  }

  async getFileById(id) {
    return File.findByPk(id);
  }

  
  async deleteFile(id) {
    const file = await File.findByPk(id);
    if (!file) {
      throw new Error('File not found');
    }
  
    const filePath = path.join(__dirname, '../../uploads/', file.id + file.extension);
  
    fs.unlinkSync(filePath);
  
    await file.destroy();
  };
}

module.exports = FileService;
