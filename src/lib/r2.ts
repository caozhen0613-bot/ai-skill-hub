import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Cloudflare R2 client (S3-compatible API)
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'ai-skill-hub';

// Upload file to R2 via presigned URL or direct upload
export async function uploadToR2(key: string, body: Buffer | Blob, contentType: string) {
  if (!process.env.R2_ENDPOINT) {
    throw new Error('R2 endpoint not configured');
  }

  const upload = new Upload({
    client: r2Client,
    params: {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType,
    },
  });

  return upload.done();
}

// Get a presigned URL for downloading
export async function getR2DownloadUrl(key: string, expiresIn: number = 3600) {
  if (!process.env.R2_ENDPOINT) {
    return null;
  }

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(r2Client, command, { expiresIn });
}

// Delete a file from R2
export async function deleteFromR2(key: string) {
  if (!process.env.R2_ENDPOINT) {
    throw new Error('R2 endpoint not configured');
  }

  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return r2Client.send(command);
}