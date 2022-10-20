import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DropdownItem } from '../models/menu.model';
import { NewUser, Role, User, UserPageModel } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
              private authService: AuthService) { }

  getUsers = async (page: number, size: number, filter?: string, order?: string, direction?: boolean): Promise<UserPageModel> => {
    let params = new HttpParams({ fromObject: { size } });

    if(order && order !== '') {
      params = params.set("ordr", order);
    }
    if(direction === true) {
      params = params.set("dir", direction);
    }

    if(filter && filter !== '') {
      params = params.set("filt", filter);
    }

    try {
      const response = await lastValueFrom(this.http.get<UserPageModel>(`${this.authService.getBackendLocation()}users/page/${page}`, {
      params: params,
      headers: this.authService.getAuthHeader()
      }))
      return response;
    } catch(err) {
      if((err as HttpErrorResponse
        ).status === 401) {
        this.authService.logout();
      }
      throw { error: (err as HttpErrorResponse).error};
    }
  }

  getUser = async (id: number) => {
    try {
      const response = await lastValueFrom(this.http.get<{ user: User }>(`${this.authService.getBackendLocation()}users/${id}`, {
      headers: this.authService.getAuthHeader()
      }))
      return response.user;
    } catch(err) {
      if((err as HttpErrorResponse
        ).status === 401) {
        this.authService.logout();
      }
      throw { error: (err as HttpErrorResponse).error};
    }
  }

  updateUser = async (id: number, updatedUser: NewUser) => {
    try {
      const response = await lastValueFrom(this.http.put<{ message: string }>(`${this.authService.getBackendLocation()}users/${id}`, {
        ...updatedUser
      },{
      headers: this.authService.getAuthHeader()
      }))
      return response.message;
    } catch(err) {
      if((err as HttpErrorResponse
        ).status === 401) {
        this.authService.logout();
      }
      throw { error: (err as HttpErrorResponse).error};
    }
  }

  deleteUser = async (id: number) => {
    try {
      const response = await lastValueFrom(this.http.delete<{ message: string }>(`${this.authService.getBackendLocation()}users/${id}`, {
      headers: this.authService.getAuthHeader()
      }))
      return response.message;
    } catch(err) {
      if((err as HttpErrorResponse
        ).status === 401) {
        this.authService.logout();
      }
      throw { error: (err as HttpErrorResponse).error};
    }
  }

  getRoles = async () => {
    try {
      const response = await lastValueFrom(this.http.get<{ roles: Role[] }>(`${this.authService.getBackendLocation()}auth/roles`, {
      headers: this.authService.getAuthHeader()
      }))
      return response.roles;
    } catch(err) {
      if((err as HttpErrorResponse
        ).status === 401) {
        this.authService.logout();
      }
      throw { error: (err as HttpErrorResponse).error};
    }
  }

  getOrders = (): DropdownItem[] => {
    return [
      { shownValue: "Nincs", value: "" },
      { shownValue: "Név", value: "name" },
      { shownValue: "Felhasználónév", value: "username"},
      { shownValue: "Email", value: "email"},
      { shownValue: "Születésnap", value: "birthdate"},
      { shownValue: "Létrehozás dátuma", value: "created"},
    ]
  }
}
