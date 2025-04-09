import multer, { FileFilterCallback } from 'multer';

// Configure multer for file uploads
const storage = multer.memoryStorage();

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  console.log('File being uploaded:', file.originalname, 'MIME type:', file.mimetype);
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.log('Invalid file type:', file.mimetype);
    cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 3 * 1024 * 1024 // 3MB limit
  },
  fileFilter
}); 