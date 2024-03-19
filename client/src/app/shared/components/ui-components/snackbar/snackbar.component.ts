import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent {
  @Input() name: string;
  @Input() bagType: string = 'cart';
  @Input() route: string = 'cart';
  @Input() isShown = false;

}
