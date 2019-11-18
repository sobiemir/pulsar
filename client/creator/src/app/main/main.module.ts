import { NgModule } from '@angular/core';
import { RootComponent } from './root/root.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ROUTES } from './main.routes';
import { NebulaModule } from 'nebula';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { MenuComponent } from './menu/menu.component';
import { PagesComponent } from './pages/pages.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [
    RootComponent,
    BreadcrumbsComponent,
    MenuComponent,
    PagesComponent,
    SidebarComponent
  ],
  imports: [
    NebulaModule,
    BrowserModule,
    RouterModule.forRoot(ROUTES)
  ],
  bootstrap: [RootComponent]
})
export class MainModule {}
