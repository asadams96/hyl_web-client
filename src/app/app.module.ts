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

const appRoutes: Routes = [
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  { path: '', component : PublicLayoutComponent , children: PUBLIC_ROUTES },
  { path: 'secure', component : SecureLayoutComponent , children: SECURE_ROUTES },
  {path: '**', redirectTo: '/secure'}
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
    SignupComponent
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
    SigninComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
