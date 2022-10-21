import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { lastValueFrom, Subject, Subscription } from 'rxjs';
import { LoginData, NewUser, User } from '../models/user.model';
import { BackendLocations, SidebarItem, StoredSidebarItem } from '../models/menu.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService{
  private backendLocation: string;
  private backendLocations: BackendLocations;
  private token?: string;
  private user?: User;
  private userObserver!: Subject<User | undefined>;
  constructor(private http: HttpClient,
              private router: Router) {
    this.userObserver = new Subject();

    this.backendLocations = {
      fastify: environment.FASTIFY_API_URL,
      express: environment.EXPRESS_API_URL
    }
    const apiUrlKey = localStorage.getItem("API_URL_KEY");
    if(apiUrlKey) {
      this.backendLocation = this.backendLocations[apiUrlKey];
    } else {
      this.backendLocation = this.backendLocations["fastify"];
    }

    const tempToken = localStorage.getItem("token");
    const tempUser = localStorage.getItem("user");
    if(tempToken) {
      this.token = tempToken;
    }
    if(tempUser) {
      this.user = JSON.parse(tempUser);
    }
  }

  login = (usernameOrEmail: string, password: string): Promise<{ message: string }> => {
    return new Promise<{ message: string }> (async (resolve, reject) => {
      try {
        const response = await lastValueFrom(this.http.post<LoginData>(`${this.backendLocation}auth/login`, { usernameOrEmail, password }));
        this.token = "Bearer " + response.token;
        this.user = response.user;
        localStorage.setItem("token", this.token);
        localStorage.setItem("user", JSON.stringify(this.user));
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
        const response = await lastValueFrom(this.http.post<{ message: string }>(`${this.backendLocation}auth/signup`, { ...newUser }));
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

  getAuthHeader = () => {
    if(!this.token) {
      return new HttpHeaders()
    }

    return new HttpHeaders()
      .set("Authorization", this.token);
  }

  logout = () => {
    this.token = undefined;
    this.user = undefined;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.userObserver.next(this.user);
    this.router.navigate(['/'], { replaceUrl: true, skipLocationChange: true }).then(() => {
      this.router.navigate(['/login']);
    });
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

  getBackendLocation = ():string => {
    return this.backendLocation;
  }

  changeBackendLocation = (name: string) => {
    this.backendLocation = this.backendLocations[name];
    localStorage.setItem("API_URL_KEY", name);
  }

  isBackendActive = (name: string): boolean => {
    return this.backendLocation === this.backendLocations[name];
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
    name: "Sorozat módosítás",
    link: "/user/handle/series",
    order: 3,
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
