import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { TempUploadedImage } from '../models/image.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(private http: HttpClient,
              private authService: AuthService) { }

  upload = async (file: File) => {
    const formData: FormData = new FormData();
    formData.append("image", file, file.name);
    try {
      const response = await lastValueFrom(this.http.post<TempUploadedImage>(`${this.authService.getBackendLocation()}images`, formData, {
        headers: this.authService.getAuthHeader()
      }));
      return response;
    } catch(err) {
      if((err as HttpErrorResponse).status === 401) {
        this.authService.logout();
      }
      throw { error: (err as HttpErrorResponse).error};
    }
  }

  getImageUrl = async (path: string) => {
    try {
      await lastValueFrom(this.http.get(`${this.authService.getBackendLocation()}images/public/${path}`));
      return `${this.authService.getBackendLocation()}images/public/${path}`;
    } catch(err) {
      if((err as HttpErrorResponse).status === 200) {
        return `${this.authService.getBackendLocation()}images/public/${path}`;
      }
      return "assets/no_image.png";
    }
  }

  getDefaultImageUrl = () => {
    return "assets/no_image.png";
  }
}
