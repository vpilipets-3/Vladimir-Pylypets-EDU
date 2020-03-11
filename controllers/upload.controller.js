const save = require('save-file');
const db = require('../models');

const uploadController = {
  render: async (req, res) => {
    res.send(`
    <form action="/api/upload" enctype="multipart/form-data" method="post">
      <div>File to upload: <input type="file" name="FILE" multiple="multiple" /></div>
      <input type="submit" value="Upload" />
    </form>
  `);
  },
  upload: async (req, res) => {
    try {
      console.log(req.file);
      await db.File.create({
        fileName: req.file.originalname,
        data: req.file.buffer,
        size: req.file.size,
      });
      return res.status(200).json('File uploaded!');
    } catch (e) {
      return res.status(500).json({ message: `${e}` });
    }
  },
  download: async (req, res) => {
    try {
      const blob = await db.File.findOne({ where: { id: req.params.fileID } });
      blob.lastModifiedDate = new Date();
      blob.name = blob.fileName;
      await save(blob.data, blob.fileName);
      return await res.download(`./${blob.fileName}`);
    } catch (e) {
      return res.status(500).json({ message: `${e}` });
    }
  },
};

module.exports = uploadController;
