import { Client, Storage, InputFile } from 'appwrite';
import { env } from '../config/env';
import { handleExternalError } from '../utils/errorWrapper';

const client = new Client()
  .setEndpoint(env.APPWRITE_ENDPOINT)
  .setProject(env.APPWRITE_PROJECT_ID)
  // You need to manually set APPWRITE_API_KEY in your .env file
  .setKey(env.APPWRITE_API_KEY);

const storage = new Storage(client);

// I upload a file to Appwrite and return the file id and url
export async function uploadToAppwrite(file: Express.Multer.File) {
  try {
    const input = InputFile.fromBuffer(file.buffer, file.originalname);
    const result = await storage.createFile(env.APPWRITE_BUCKET_ID, 'unique()', input);

    const fileId = result.$id;
    const fileUrl = `${env.APPWRITE_ENDPOINT}/storage/buckets/${env.APPWRITE_BUCKET_ID}/files/${fileId}/view?project=${env.APPWRITE_PROJECT_ID}`;

    return { fileId, fileUrl };
  } catch (error) {
    throw handleExternalError('appwrite', error);
  }
}
