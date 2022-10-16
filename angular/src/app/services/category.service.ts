import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../models/series.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient,
              private authService: AuthService) { }

  getCategories = async () => {
    try {
      const response = await lastValueFrom(this.http.get<{ categories: Category[] }>(`${environment.API_URL}categories`, {
      headers: this.authService.getAuthHeader()
      }));
      return response.categories;
    } catch(err) {
      if((err as HttpErrorResponse).status === 401) {
        this.authService.logout();
      }
      throw { error: (err as HttpErrorResponse).error};
    }
  }

  saveCategory = async (newCategory: Category) => {
    try {
      const response = await lastValueFrom(this.http.post<{ category: Category }>(`${environment.API_URL}categories`, {
        newCategory
      }, {
      headers: this.authService.getAuthHeader()
      }));
      return response.category;
    } catch(err) {
      if((err as HttpErrorResponse).status === 401) {
        this.authService.logout();
      }
      throw { error: (err as HttpErrorResponse).error};
    }
  }

  updateCategory = async (id: number, updatedCategory: Category) => {
    try {
      const response = await lastValueFrom(this.http.put<{ message: string }>(`${environment.API_URL}statuses/${id}`, {
        updatedCategory
      },{
      headers: this.authService.getAuthHeader()
      }));
      return response.message;
    } catch(err) {
      if((err as HttpErrorResponse).status === 401) {
        this.authService.logout();
      }
      throw { error: (err as HttpErrorResponse).error};
    }
  }
}
