import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Routes, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {PUBLIC_ROUTES} from '../layout/public-layout/public-layout.component';
import {SECURE_ROUTES} from '../layout/secure-layout/secure-layout.component';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


    const url = route.firstChild.url[0];
    const isAuth: string = this.authService.auth;
    if (isAuth) {
      if (checkPathFromRoutes(url.path, PUBLIC_ROUTES)) {
        this.router.navigate(['/dashboard']);
      } else if (checkPathFromRoutes(url.path, SECURE_ROUTES)) {
        return true;
      }
    } else {
      if (checkPathFromRoutes(url.path, PUBLIC_ROUTES)) {
        return true;
      } else if (checkPathFromRoutes(url.path, SECURE_ROUTES)) {
        this.router.navigate(['/signin']);
      }
    }


    function checkPathFromRoutes(pathToCheck: string, routes: Routes) {
      const count = routes.length;
      for (let i = 0; i < count; i++) {
        if (routes[i].path === pathToCheck) {
          return true;
        }
      }
      return false;
    }
  }
}
