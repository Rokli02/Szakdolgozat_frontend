import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DropdownItem } from '../models/menu.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserSeriesService {

  constructor(private http: HttpClient,
              private authService: AuthService) { }

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
