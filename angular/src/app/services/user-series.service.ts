import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DropdownItem } from '../models/menu.model';
import { Series, Status, UserSeries, UserSeriesPageModel } from '../models/series.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserSeriesService {

  constructor(private http: HttpClient,
              private authService: AuthService) { }

  getUserSerieses = async (page: number, size: number, status?: number, filter?: string, order?: string, direction?: boolean): Promise<UserSeriesPageModel> => {
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

    if(status && status > 0) {
      params = params.set("stat", status);
    }

    try {
      const response = await lastValueFrom(this.http.get<UserSeriesPageModel>(`${this.authService.getBackendLocation()}user/series/page/${page}`, {
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

  getUserSeries = async (id: number) => {
    try {
      const response = await lastValueFrom(this.http.get<{ series: UserSeries}>(`${this.authService.getBackendLocation()}user/series/${id}`, {
        headers: this.authService.getAuthHeader()
      }))
      return response.series;
    } catch(err) {
      if((err as HttpErrorResponse).status === 401) {
        this.authService.logout();
      }
      throw { error: (err as HttpErrorResponse).error};
    }
  }

  saveUserSeries = async (newUserseries: UserSeries) => {
    try {
      const response = await lastValueFrom(this.http.post<{ series: UserSeries }>(`${this.authService.getBackendLocation()}user/series`, {
        ...newUserseries
      },{
        headers: this.authService.getAuthHeader()
      }))
      return response.series;
    } catch(err) {
      if((err as HttpErrorResponse).status === 401) {
        this.authService.logout();
      }
      throw { error: (err as HttpErrorResponse).error};
    }
  }

  defaultSaveUserSeries = async (seriesId: number) => {
    const newUserseries: UserSeries = {
       series: { id: seriesId } as Series,
       season: 1,
       episode: 1,
       status: { id: 1 } as Status
    }
    try {
      const response = await lastValueFrom(this.http.post<{ series: UserSeries }>(`${this.authService.getBackendLocation()}user/series`, {
        ...newUserseries
      },{
        headers: this.authService.getAuthHeader()
      }))
      return response.series;
    } catch(err) {
      if((err as HttpErrorResponse).status === 401) {
        this.authService.logout();
      }
      throw { error: (err as HttpErrorResponse).error};
    }
  }

  updateUserSeries = async (id: number, updateUserseries: UserSeries) => {
    try {
      const response = await lastValueFrom(this.http.put<{ message: string }>(`${this.authService.getBackendLocation()}user/series/${id}`, {
        ...updateUserseries
      },{
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

  deleteUserSeries = async (id: number) => {
    try {
      const response = await lastValueFrom(this.http.delete<{ message: string }>(`${this.authService.getBackendLocation()}user/series/${id}`, {
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
      { shownValue: "Korhatár", value: "age_limit"},
      { shownValue: "Hossz", value: "length"},
      { shownValue: "Utolsó módosítás", value: "modification"},
      { shownValue: "Kiadási év", value: "prod_year"}
    ]
  }
}
