const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storageGame = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
      folder: 'games',
  },
  allowedFormats: ['jpg', 'jpeg', 'png'],
  filename: function (req, res, cb) {
    cb(null, res.originalname); // The file on cloudinary would have the same name as the original file name
  }
});

const storageUser = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'users',
    },
    allowedFormats: ['jpg', 'jpeg', 'png'],
    filename: function (req, res, cb) {
      cb(null, res.originalname); 
    }
});


const uploadGameImg = multer({ storage: storageGame });
const uploadUserImg = multer({ storage: storageUser });

module.exports = {
    uploadGameImg,
    uploadUserImg,
};
