import { diskStorage } from 'multer';
import { extname } from 'path';
export const fileUploadPath = './uploads';
export const multerConfig = {
  storage: diskStorage({
    destination: fileUploadPath,
    filename: (req, file, callback) => {
      const uniqueSuffix = `${Date.now()}`;
      const fileExtension = extname(file.originalname);
      callback(null, `${uniqueSuffix}${fileExtension}`);
    },
  }),
};
