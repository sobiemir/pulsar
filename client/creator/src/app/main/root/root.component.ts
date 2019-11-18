import { Component, OnInit } from '@angular/core';
import { environment } from 'client/creator/src/environments/environment';

@Component({
  selector: 'prc-root',
  templateUrl: './root.component.html',
  styles: []
})
export class RootComponent implements OnInit {

  public version = environment.version;
  public codename = environment.codename;
  public production = environment.production;
  public hasSidebar = true;

  public constructor() {}

  public ngOnInit(): void {
  }

}
