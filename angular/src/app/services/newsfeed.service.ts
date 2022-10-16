import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DropdownItem } from '../models/menu.model';
import { Newsfeed, NewsfeedPageModel } from '../models/newsfeed.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NewsfeedService {

  constructor(private http: HttpClient,
              private authService: AuthService) { }

  getNewsfeeds = async (page: number, size: number, filter?: string, order?: string, direction?: boolean): Promise<NewsfeedPageModel> => {
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
      const response = await lastValueFrom(this.http.get<NewsfeedPageModel>(`${environment.API_URL}newsfeeds/page/${page}`, {
      params: params,
      headers: this.authService.getAuthHeader()
      }))
      return response;
    } catch(err) {
      if((err as HttpErrorResponse).status === 401) {
        this.authService.logout();
      }
      throw { error: (err as HttpErrorResponse).error};
    }
  }

  getPersonalNewsfeeds = async (page: number, size: number, filter?: string, order?: string, direction?: boolean): Promise<NewsfeedPageModel> => {
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
      const response = await lastValueFrom(this.http.get<NewsfeedPageModel>(`${environment.API_URL}newsfeeds/personal/page/${page}`, {
        params: params,
        headers: this.authService.getAuthHeader()
      }))
      return response;
    } catch(err) {
      if((err as HttpErrorResponse).status === 401) {
        this.authService.logout();
      }
      throw { error: (err as HttpErrorResponse).error};
    }
  }

  getNewsfeed = async (id: number) => {
    try {
      const response = await lastValueFrom(this.http.get<{ newsfeed: Newsfeed}>(`${environment.API_URL}newsfeeds/${id}`, {
        headers: this.authService.getAuthHeader()
      }))
      return response.newsfeed;
    } catch(err) {
      if((err as HttpErrorResponse).status === 401) {
        this.authService.logout();
      }
      throw { error: (err as HttpErrorResponse).error};
    }
  }

  saveNewsfeed = async (newNewsfeed: Newsfeed) => {
    try {
      const response = await lastValueFrom(this.http.post<{ newsfeed: Newsfeed}>(`${environment.API_URL}newsfeeds`, {
        newNewsfeed
      }, {
        headers: this.authService.getAuthHeader()
      }))
      return response.newsfeed;
    } catch(err) {
      if((err as HttpErrorResponse).status === 401) {
        this.authService.logout();
      }
      throw { error: (err as HttpErrorResponse).error};
    }
  }

  updateNewsfeed = async (id: number, updatedNewsfeed: Newsfeed) => {
    try {
      const response = await lastValueFrom(this.http.post<{ message: string }>(`${environment.API_URL}newsfeeds/${id}`, {
        updatedNewsfeed
      }, {
        headers: this.authService.getAuthHeader()
      }))
      return response.message;
    } catch(err) {
      if((err as HttpErrorResponse).status === 401) {
        this.authService.logout();
      }
      throw { error: (err as HttpErrorResponse).error};
    }
  }

  deleteNewsfeed = async (id: number) => {
    try {
      const response = await lastValueFrom(this.http.delete<{ message: string }>(`${environment.API_URL}newsfeeds/${id}`, {
        headers: this.authService.getAuthHeader()
      }))
      return response.message;
    } catch(err) {
      if((err as HttpErrorResponse).status === 401) {
        this.authService.logout();
      }
      throw { error: (err as HttpErrorResponse).error};
    }
  }

  getOrders = (): DropdownItem[] => {
    return [
      { shownValue: "Nincs", value: "" },
      { shownValue: "Cím", value: "title" },
      { shownValue: "Sorozat", value: "series"},
      { shownValue: "Utolsó módosítás", value: "modification"}
    ]
  }
}
