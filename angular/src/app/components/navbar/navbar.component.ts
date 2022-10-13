import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Event, NavigationEnd, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { SidebarItem } from 'src/app/models/menu.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  private routerSub!: Subscription;
  private userSub!: Subscription;
  user?: User;
  sidebarItems?: SidebarItem[];
  isLoginPage: boolean;

  constructor(private authService: AuthService, private router: Router) {
    this.isLoginPage = false;
  }

  ngOnInit(): void {
    this.routerSub = this.router.events.subscribe((event: Event) => {
      if(event instanceof NavigationEnd) {
        const { url } = event;
        if(url === "/login"){
          this.isLoginPage = true;
        } else {
          this.isLoginPage = false;
        }
      }
    });

    this.userSub = this.authService.getUserObserver((nextUser) => {
      this.user = nextUser;
      this.sidebarItems = this.authService.getSidebarItems();
      console.log(nextUser);
    })
  }

  ngOnDestroy(): void {
    if(!this.routerSub.closed) {
      this.routerSub.unsubscribe();
    }
    if(!this.userSub.closed) {
      this.userSub.unsubscribe();
    }
  }

  hasUser = (): boolean => {
    return this.user !== undefined;
  }
}
