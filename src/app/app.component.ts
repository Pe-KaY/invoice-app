import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadInvoices } from './store/store.actions';
import { InvoiceComponent } from './invoice/invoice.component';
import { selectInvoices } from './selectors/invoice.selectors';
import { AppState } from './store/store.reducer';
import { Invoice } from '../interfaces/invoice-interface';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,InvoiceComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'invoice-app';

  invoices$! : Observable<Invoice[]>

constructor(private store: Store) {

  this.store.dispatch(loadInvoices());
}

ngOnInit() {
  this.invoices$ = this.store.select(selectInvoices);
}

}
