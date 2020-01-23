import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {PUBLIC_ROUTES, PublicLayoutComponent} from './layout/public-layout/public-layout.component';
import {SECURE_ROUTES, SecureLayoutComponent} from './layout/secure-layout/secure-layout.component';
import {RouterModule, Routes} from '@angular/router';
import { SidebarComponent } from './layout/secure-layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/secure-layout/footer/footer.component';
import { TopbarComponent } from './layout/secure-layout/topbar/topbar.component';
import { SigninComponent } from './auth/signin/signin.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {AuthService} from './auth/auth.service';
import { SignupComponent } from './auth/signup/signup.component';
import {AuthGuard} from './guards/auth.guard';
import { SignoutComponent } from './auth/signout/signout.component';
import { ListItemComponent } from './item/list-item/list-item.component';
import {ItemService} from './item/item.service';
import { CategoryComponent } from './item/list-item/category/category.component';
import { ItemComponent } from './item/list-item/item/item.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/signin', pathMatch: 'full', canActivate: [AuthGuard]},
  { path: '', component : PublicLayoutComponent , children: PUBLIC_ROUTES, canActivate: [AuthGuard] },
  { path: '', component : SecureLayoutComponent , children: SECURE_ROUTES, canActivate: [AuthGuard] },
  // TODO EDITER LA ROUTE PAR SIGNIN QUAND COMPOSANT SECURE CREE -> Evite bug pour le moment en simulant route /dashboard
  {path: '**', component: SecureLayoutComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    PublicLayoutComponent,
    SecureLayoutComponent,
    SidebarComponent,
    FooterComponent,
    TopbarComponent,
    SigninComponent,
    SignupComponent,
    SignoutComponent,
    ListItemComponent,
    CategoryComponent,
    ItemComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    ReactiveFormsModule,
    AuthService,
    HttpClient,
    SigninComponent,
    ItemService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
