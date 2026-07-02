const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../configure/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {
    let folder = "products";

    let resource_type = "image";

    if (file.fieldname === "thumbnail") {
      folder = "products/thumbnails";
    }

    if (file.fieldname === "images") {
      folder = "products/images";
    }

    if (file.fieldname === "videos") {
      folder = "products/videos";
      resource_type = "video";
    }

    return {
  folder,
  resource_type,
  format: file.mimetype.split("/")[1],
  allowed_formats: [
    "jpg",
    "jpeg",
    "png",
    "webp",
    "mp4",
    "mov",
    "avi",
    "mkv",
    "webm",
  ],
};
  },
});

const fileFilter = (req, file, cb) => {
  const imageMime = file.mimetype.startsWith("image/");
  const videoMime = file.mimetype.startsWith("video/");

  if (
    (file.fieldname === "thumbnail" || file.fieldname === "images") &&
    imageMime
  ) {
    return cb(null, true);
  }

  if (file.fieldname === "videos" && videoMime) {
    return cb(null, true);
  }

  return cb(
  new Error(
    "Only image files are allowed for thumbnail/images and video files for videos."
  )
);
};

module.exports = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});