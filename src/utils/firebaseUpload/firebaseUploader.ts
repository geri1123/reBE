import { bucket } from "../../config/firebase.js";

export const uploadFileToFirebase = async (
  file: Express.Multer.File,
  folder: string
): Promise<string> => {
  if (!file) throw new Error("No file provided");

  
  const sanitizedFileName = file.originalname.replace(/\s+/g, "_");

  const fileName = `${folder}/${Date.now()}_${sanitizedFileName}`;
  const fileUpload = bucket.file(fileName);

  await fileUpload.save(file.buffer, {
    contentType: file.mimetype,
    public: true, //optional
  });


  return fileName;
};
