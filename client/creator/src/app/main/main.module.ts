import { NgModule } from '@angular/core';
import { RootComponent } from './root/root.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ROUTES } from './main.routes';

@NgModule({
  declarations: [
    RootComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES)
  ],
  bootstrap: [RootComponent]
})
export class MainModule {}
