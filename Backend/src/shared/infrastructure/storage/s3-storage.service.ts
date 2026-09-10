import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { IObjectStorageService, UploadFileInput, PresignedUrlResult } from '../../domain/ports/object-storage.interface.js';

export class S3StorageService implements IObjectStorageService {
  private s3Client: S3Client | null = null;
  private bucketName: string;
  private region: string;
  private cdnUrl?: string;

  constructor() {
    this.bucketName = process.env.AWS_S3_BUCKET || 'autoversus-media-assets';
    this.region = process.env.AWS_REGION || 'us-east-1';
    this.cdnUrl = process.env.CDN_BASE_URL || undefined;

    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const endpoint = process.env.S3_ENDPOINT;

    if (accessKeyId && secretAccessKey) {
      this.s3Client = new S3Client({
        region: this.region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
        endpoint: endpoint || undefined,
        forcePathStyle: !!endpoint,
      });
    }
  }

  private generateKey(fileName: string, folder = 'media'): string {
    const timestamp = Date.now();
    const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `${folder}/${timestamp}-${sanitizedName}`;
  }

  private getPublicUrl(key: string): string {
    if (this.cdnUrl) {
      return `${this.cdnUrl.replace(/\/$/, '')}/${key}`;
    }
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
  }

  public async uploadFile(input: UploadFileInput): Promise<string> {
    const key = this.generateKey(input.fileName, input.folder);

    if (!this.s3Client) {
      console.warn('[S3StorageService] AWS credentials unconfigured. Returning mock CDN URL.');
      return this.getPublicUrl(key);
    }

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: input.buffer,
      ContentType: input.mimeType,
    });

    await this.s3Client.send(command);
    return this.getPublicUrl(key);
  }

  public async getPresignedUploadUrl(
    fileName: string,
    mimeType: string,
    folder = 'media'
  ): Promise<PresignedUrlResult> {
    const key = this.generateKey(fileName, folder);
    const expiresInSeconds = 900; // 15 minutes

    if (!this.s3Client) {
      console.warn('[S3StorageService] AWS credentials unconfigured. Returning mock presigned URL.');
      return {
        uploadUrl: `https://mock-s3-upload.local/${key}`,
        fileUrl: this.getPublicUrl(key),
        key,
        expiresInSeconds,
      };
    }

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: mimeType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: expiresInSeconds });
    const fileUrl = this.getPublicUrl(key);

    return {
      uploadUrl,
      fileUrl,
      key,
      expiresInSeconds,
    };
  }

  public async deleteFile(fileKey: string): Promise<boolean> {
    if (!this.s3Client) {
      return true;
    }

    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });
      await this.s3Client.send(command);
      return true;
    } catch (err: any) {
      console.warn(`[S3StorageService] Failed to delete object ${fileKey}:`, err.message);
      return false;
    }
  }
}

export const s3StorageService = new S3StorageService();
