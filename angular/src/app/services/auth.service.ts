import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { lastValueFrom, Observable, Subject, Subscription } from 'rxjs';
import { LoginData, NewUser, User } from '../models/user.model';
import { SidebarItem, StoredSidebarItem } from '../models/menu.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token?: string;
  private user?: User;
  private userObserver!: Subject<User | undefined>;
  constructor(private http: HttpClient,
              private router: Router) {
    this.userObserver = new Subject();
  }

  login = (usernameOrEmail: string, password: string): Promise<{ message: string }> => {
    return new Promise<{ message: string }> (async (resolve, reject) => {
      try {
        const response = await lastValueFrom(this.http.post<LoginData>(`${environment.API_URL}auth/login`, { usernameOrEmail, password }));
        this.token = response.token;
        this.user = response.user;
        this.userObserver.next(this.user);
        resolve({ message: "Logged in succesfully!" });
      } catch(err) {
        reject({ message: (err as HttpErrorResponse).error.message })
      }
    });
  }

  signup = (newUser: NewUser): Promise<{ message: string }> => {
    return new Promise<{ message: string }> (async (resolve, reject) => {
      try {
        const response = await lastValueFrom(this.http.post<{ message: string }>(`${environment.API_URL}auth/signup`, { ...newUser }));
        resolve(response);
      } catch(err) {
        reject({ message: (err as HttpErrorResponse).error.message })
      }
    });
  }

  isSignedIn = (): boolean => {
    return this.token !== undefined && this.user !== undefined;
  }

  hasRight = (rights: string[]): boolean => {
    if(!this.isSignedIn()) {
      return false;
    }

    for(let right of rights) {
      if(right === this.user?.role.name) {
        return true;
      }
    }

    return false;
  }

  getUser = () => {
    return this.user;
  }

  getUserObserver = (setterFunc: (user?: User) => void): Subscription => {
    return this.userObserver.subscribe(setterFunc);
  }

  logout = () => {
    this.token = undefined;
    this.user = undefined;
    this.userObserver.next(this.user);
    this.router.navigate(['/'], { replaceUrl: true });
  }

  getSidebarItems = (): SidebarItem[] | undefined => {
    if(!this.isSignedIn()) {
      return undefined;
    }

    const items: SidebarItem[] = SidebarItems.filter((item) => item.right.length === 0 || this.hasRight(item.right))
      .sort((a, b) => a.order - b.order)
      .map((item) => ({ name: item.name, link: item.link }) as SidebarItem);

    return items;
  }
}

const SidebarItems: StoredSidebarItem[] = [
  {
    name: "Sorozataim",
    link: "/user/series",
    order: 1,
    right: ["user"]
  },
  {
    name: "Híreim",
    link: "/user/newsfeed",
    order: 2,
    right: ["user"]
  },
  {
    name: "Kijelentkezés",
    link: "/logout",
    order: 99,
    right: []
  },
  {
    name: "Felhasználó kezelés",
    link: "/admin/user",
    order: 1,
    right: ["admin"]
  },
  {
    name: "Sorozat kezelés",
    link: "/admin/series",
    order: 2,
    right: ["admin", "siteManager"]
  },
  {
    name: "Újdonság kezelés",
    link: "/admin/newsfeed",
    order: 3,
    right: ["admin", "siteManager"]
  },
  {
    name: "Egyéb tulajdonság kezelés",
    link: "/admin/misc",
    order: 4,
    right: ["admin", "siteManager"]
  }
]
