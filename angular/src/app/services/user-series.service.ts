import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DropdownItem } from '../models/menu.model';
import { UserSeriesPageModel } from '../models/series.model';
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
      const response = await lastValueFrom(this.http.get<UserSeriesPageModel>(`${environment.API_URL}user/series/page/${page}`, {
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

  getOrders = (): DropdownItem[] => {
    return [
      { shownValue: "Nincs", value: "" },
      { shownValue: "Cím", value: "title" },
      { shownValue: "Korhatár", value: "ageLimit"},
      { shownValue: "Hossz", value: "length"},
      { shownValue: "Utolsó módosítás", value: "modification"},
      { shownValue: "Kiadási év", value: "prodYear"}
    ]
  }
}
