export interface UploadFileInput {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  folder?: string;
}

export interface PresignedUrlResult {
  uploadUrl: string;
  fileUrl: string;
  key: string;
  expiresInSeconds: number;
}

export interface IObjectStorageService {
  uploadFile(input: UploadFileInput): Promise<string>;
  getPresignedUploadUrl(fileName: string, mimeType: string, folder?: string): Promise<PresignedUrlResult>;
  deleteFile(fileKey: string): Promise<boolean>;
}
