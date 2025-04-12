"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultiplePhotos = exports.uploadMainPhoto = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
// Configure AWS S3 client
const s3Client = new client_s3_1.S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
});
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/tmp/uploads');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
        }
    }
});
const unlinkFile = util_1.default.promisify(fs_1.default.unlink);
// Function 1: Save a single main photo to S3
const uploadMainPhoto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Use multer middleware to handle the file upload
        const uploadSingle = util_1.default.promisify(upload.single('mainPhoto'));
        yield uploadSingle(req, res);
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const file = req.file;
        // Generate a unique filename for S3
        const key = `main-photos/${(0, uuid_1.v4)()}${path_1.default.extname(file.originalname)}`;
        // Prepare the upload parameters
        const uploadParams = {
            Bucket: process.env.S3_BUCKET_NAME || 'my-app-bucket',
            Key: key,
            Body: fs_1.default.createReadStream(file.path),
            ContentType: file.mimetype,
        };
        // Upload to S3
        yield s3Client.send(new client_s3_1.PutObjectCommand(uploadParams));
        // Clean up the temporary file
        yield unlinkFile(file.path);
        // Generate the URL for the uploaded file
        const fileUrl = `https://${uploadParams.Bucket}.s3.amazonaws.com/${key}`;
        return res.status(200).json({
            message: 'Main photo uploaded successfully',
            fileUrl,
            key
        });
    }
    catch (error) {
        console.error('Error uploading main photo:', error);
        return res.status(500).json({
            error: 'Failed to upload main photo',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.uploadMainPhoto = uploadMainPhoto;
// Function 2: Save multiple photos to S3 using Promise.all
const uploadMultiplePhotos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Use multer middleware to handle multiple file uploads
        const uploadMultiple = util_1.default.promisify(upload.array('photos', 10)); // Maximum 10 photos
        yield uploadMultiple(req, res);
        if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
            return res.status(400).json({ error: 'No files uploaded' });
        }
        const files = req.files;
        // Define the function to upload a single file to S3
        const uploadFileToS3 = (file) => __awaiter(void 0, void 0, void 0, function* () {
            const key = `photos/${(0, uuid_1.v4)()}${path_1.default.extname(file.originalname)}`;
            const uploadParams = {
                Bucket: process.env.S3_BUCKET_NAME || 'my-app-bucket',
                Key: key,
                Body: fs_1.default.createReadStream(file.path),
                ContentType: file.mimetype,
            };
            // Upload to S3
            yield s3Client.send(new client_s3_1.PutObjectCommand(uploadParams));
            // Clean up the temporary file
            yield unlinkFile(file.path);
            return {
                originalName: file.originalname,
                key,
                url: `https://${uploadParams.Bucket}.s3.amazonaws.com/${key}`,
                size: file.size,
                mimetype: file.mimetype
            };
        });
        // Upload all files concurrently using Promise.all
        const uploadPromises = files.map(file => uploadFileToS3(file));
        const uploadResults = yield Promise.all(uploadPromises);
        return res.status(200).json({
            message: `Successfully uploaded ${uploadResults.length} photos`,
            files: uploadResults
        });
    }
    catch (error) {
        console.error('Error uploading multiple photos:', error);
        return res.status(500).json({
            error: 'Failed to upload photos',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.uploadMultiplePhotos = uploadMultiplePhotos;
