import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Status } from '../models/series.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor(private http: HttpClient,
              private authService: AuthService) {}

  getStatuses = async () => {
    try {
      const response = await lastValueFrom(this.http.get<{ statuses: Status[] }>(`${this.authService.getBackendLocation()}statuses`, {
      headers: this.authService.getAuthHeader()
      }));
      return response.statuses;
    } catch(err) {
      if((err as HttpErrorResponse).status === 401) {
        this.authService.logout();
      }
      throw { error: (err as HttpErrorResponse).error};
    }
  }

  saveStatus = async (newStatus: Status) => {
    try {
      const response = await lastValueFrom(this.http.post<{ status: Status }>(`${this.authService.getBackendLocation()}statuses`, {
        ...newStatus
      }, {
      headers: this.authService.getAuthHeader()
      }));
      return response.status;
    } catch(err) {
      if((err as HttpErrorResponse).status === 401) {
        this.authService.logout();
      }
      throw { error: (err as HttpErrorResponse).error};
    }
  }

  updateStatus = async (id: number, updatedStatus: Status) => {
    try {
      const response = await lastValueFrom(this.http.put<{ message: string }>(`${this.authService.getBackendLocation()}statuses/${id}`, {
        ...updatedStatus
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
