import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {PUBLIC_ROUTES, PublicLayoutComponent} from './layout/public-layout/public-layout.component';
import {SECURE_ROUTES, SecureLayoutComponent} from './layout/secure-layout/secure-layout.component';
import {RouterModule, Routes} from '@angular/router';
import { SidebarComponent } from './layout/secure-layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/secure-layout/footer/footer.component';
import { TopbarComponent } from './layout/secure-layout/topbar/topbar.component';

const appRoutes: Routes = [
  { path: 'public', component : PublicLayoutComponent , children: PUBLIC_ROUTES },
  { path: 'secure', component : SecureLayoutComponent , children: SECURE_ROUTES }
];

@NgModule({
  declarations: [
    AppComponent,
    PublicLayoutComponent,
    SecureLayoutComponent,
    SidebarComponent,
    FooterComponent,
    TopbarComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
