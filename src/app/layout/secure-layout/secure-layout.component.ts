import {Component, OnInit} from '@angular/core';
import {Router, Routes, RoutesRecognized} from '@angular/router';
import {ListItemComponent} from '../../item/list-item/list-item.component';
import {ProfilComponent} from '../../user/profil/profil.component';

export const SECURE_ROUTES: Routes = [
  {path: 'inventaire', component: ListItemComponent},
  {path: 'profil', component: ProfilComponent}
];

@Component({
  selector: 'app-secure-layout',
  templateUrl: './secure-layout.component.html',
  styleUrls: ['./secure-layout.component.scss']
})
export class SecureLayoutComponent implements OnInit {

  style: string;

  constructor(private router: Router) {}

  ngOnInit() {
    this.initStyle();
  }

  initStyle() {
    this.style = this.router.url.slice(1);
    this.router.events.subscribe((event: RoutesRecognized) => {
      if (event && event.urlAfterRedirects) {
        if (event.urlAfterRedirects === '/inventaire') {
          this.style = 'inventaire';
        } else if (event.urlAfterRedirects === '/profil') {
          this.style = 'profil';
        }
      }
    });
  }
}
