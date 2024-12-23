const multer = require('multer');
const express = require('express');
const router = express.Router();
const Product = require('../models/product');
// Set up Multer for multi-file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/'); // Save files to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Route to handle product image uploads
router.post('/upload-images/:productId', upload.array('images', 5), async (req, res) => {
  try {
    const { productId } = req.params;
    const imagePaths = req.files.map(file => file.path);

    // Update the product with the image paths
    await Product.findByIdAndUpdate(productId, {
      $push: { images: { $each: imagePaths } },
    });

    res.status(200).json({ message: 'Images uploaded successfully', imagePaths });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

module.exports = router;
