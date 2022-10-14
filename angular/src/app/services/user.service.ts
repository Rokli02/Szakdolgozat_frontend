import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DropdownItem } from '../models/menu.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
              private authService: AuthService) { }

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
