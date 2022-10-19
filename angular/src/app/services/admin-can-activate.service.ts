import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminCanActivateService implements CanActivate {
  constructor(private authService: AuthService,
              private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const hasRight = this.authService.hasRight(["admin"]);
    if(!hasRight) {
      this.router.navigate(['/'], { replaceUrl: true });
    }
    return hasRight;
  }
}
