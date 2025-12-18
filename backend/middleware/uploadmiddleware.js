const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const storage = multer.memoryStorage();

const upload = multer({ storage });

// Middleware to upload to Cloudinary and expose req.imageUrl
const uploadToCloudinary = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "mini-event-platform" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await streamUpload();
    req.imageUrl = result.secure_url;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { upload, uploadToCloudinary };
