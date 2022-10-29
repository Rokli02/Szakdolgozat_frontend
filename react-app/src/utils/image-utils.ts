import { TempUploadedImage } from '../models/image.model';
import http from './axiosConfig';

export const uploadRequest = async (file: File) => {
  const formData: FormData = new FormData();
  formData.append("image", file, file.name);
  return await http.post<TempUploadedImage>("images", {
    formData
  })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
}

export const getImageUrlRequest = async (path: string) => {
  try {
    await http.get(`images/public/${path}`);
    return `${http.getUri()}images/public/${path}`;
  } catch(err) {
    return getDefaultImageUrl();
  }
}

export const getDefaultImageUrl = () => {
  return "/no_image.png";
}