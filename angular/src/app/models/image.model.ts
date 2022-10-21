export type TempUploadedImage = {
  name: string;
  mimeType: string;
  path: string;
}

export type UploadableFile = {
  id?: number;
  name: string;
  mimeType?: string;
  path?: string;
  x_offset?: string;
  y_offset?: string;
}
