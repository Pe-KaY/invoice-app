import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadInvoices } from './store/store.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'invoice-app';

constructor(private store: Store) {}

ngOnInit() {
  this.store.dispatch(loadInvoices());
  console.log("hello");
  
}

}
