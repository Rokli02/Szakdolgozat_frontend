import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DropdownItem } from '../models/menu.model';
import { Series, SeriesPageModel } from '../models/series.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {

  constructor(private http: HttpClient,
              private authService: AuthService) { }

  getSerieses = async (page: number, size: number, filter?: string, order?: string, direction?: boolean): Promise<SeriesPageModel> => {
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
      const response = await lastValueFrom(this.http.get<SeriesPageModel>(`${environment.API_URL}serieses/page/${page}`, {
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

  getSeries = async (id: number): Promise<Series> => {
    try {
      const response = await lastValueFrom(this.http.get<Series>(`${environment.API_URL}serieses/${id}`, {
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

  getOrders = (): DropdownItem[] => {
    return [
      { shownValue: "Nincs", value: "" },
      { shownValue: "Cím", value: "title" },
      { shownValue: "Korhatár", value: "ageLimit"},
      { shownValue: "Hossz", value: "length"},
      { shownValue: "Kiadási év", value: "prodYear"}
    ]
  }
}
