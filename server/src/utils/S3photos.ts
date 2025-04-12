import { Request, Response } from 'express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import util from 'util';

// Configure AWS S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req :any, file :any, cb:any) => {
    cb(null, '/tmp/uploads');
  },
  filename: (req :any, file :any, cb:any) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req :any, file :any, cb:any) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.') as any, false);
    }
  }
});

const unlinkFile = util.promisify(fs.unlink);

// Function 1: Save a single main photo to S3
export const uploadMainPhoto = async (req: Request, res: Response) => {
  try {
    // Use multer middleware to handle the file upload
    const uploadSingle = util.promisify(upload.single('mainPhoto'));
    await uploadSingle(req, res);
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const file = req.file;
    
    // Generate a unique filename for S3
    const key = `main-photos/${uuidv4()}${path.extname(file.originalname)}`;
    
    // Prepare the upload parameters
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME || 'my-app-bucket',
      Key: key,
      Body: fs.createReadStream(file.path),
      ContentType: file.mimetype,
    };
    
    // Upload to S3
    await s3Client.send(new PutObjectCommand(uploadParams));
    
    // Clean up the temporary file
    await unlinkFile(file.path);
    
    // Generate the URL for the uploaded file
    const fileUrl = `https://${uploadParams.Bucket}.s3.amazonaws.com/${key}`;
    
    return res.status(200).json({
      message: 'Main photo uploaded successfully',
      fileUrl,
      key
    });
    
  } catch (error) {
    console.error('Error uploading main photo:', error);
    return res.status(500).json({
      error: 'Failed to upload main photo',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Function 2: Save multiple photos to S3 using Promise.all
export const uploadMultiplePhotos = async (req: Request, res: Response) => {
  try {
    // Use multer middleware to handle multiple file uploads
    const uploadMultiple = util.promisify(upload.array('photos', 10)); // Maximum 10 photos
    await uploadMultiple(req, res);
    
    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    const files = req.files as Express.Multer.File[];
    
    // Define the function to upload a single file to S3
    const uploadFileToS3 = async (file: Express.Multer.File) => {
      const key = `photos/${uuidv4()}${path.extname(file.originalname)}`;
      
      const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME || 'my-app-bucket',
        Key: key,
        Body: fs.createReadStream(file.path),
        ContentType: file.mimetype,
      };
      
      // Upload to S3
      await s3Client.send(new PutObjectCommand(uploadParams));
      
      // Clean up the temporary file
      await unlinkFile(file.path);
      
      return {
        originalName: file.originalname,
        key,
        url: `https://${uploadParams.Bucket}.s3.amazonaws.com/${key}`,
        size: file.size,
        mimetype: file.mimetype
      };
    };
    
    // Upload all files concurrently using Promise.all
    const uploadPromises = files.map(file => uploadFileToS3(file));
    const uploadResults = await Promise.all(uploadPromises);
    
    return res.status(200).json({
      message: `Successfully uploaded ${uploadResults.length} photos`,
      files: uploadResults
    });
    
  } catch (error) {
    console.error('Error uploading multiple photos:', error);
    return res.status(500).json({
      error: 'Failed to upload photos',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

