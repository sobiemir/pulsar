import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'prn-logo',
  templateUrl: './logo.component.html',
  styles: []
})
export class LogoComponent implements OnInit {

  @Input()
  public size = 64;
  @Input()
  public color1 = '#4a4a4a';
  @Input()
  public color2 = '#c83737';

  // scale of svg content (requested size / original size)
  public scale = 1.0;

  public constructor() {}

  public ngOnInit(): void {
    this.scale = this.size / 64;
  }

}
