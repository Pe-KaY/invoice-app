import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadInvoices } from './store/store.actions';
import {
  selectEditedInvoice,
  selectInvoices,
} from './selectors/invoice.selectors';
import { selectFilteredInvoices } from './selectors/invoice.selectors';
import { Invoice } from '../interfaces/invoice-interface';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { InvoiceService } from './service/invoice.service';
import { InvoiceComponent } from './invoice/invoice.component';
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component';
import { EditAddInvoiceComponent } from './edit-add-invoice/edit-add-invoice.component';
import * as InvoiceActions from './store/store.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    InvoiceComponent,
    CommonModule,
    ViewInvoiceComponent,
    EditAddInvoiceComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'invoice-app';

  invoices$!: Observable<Invoice[]>;
  // dark or light mode icons
  sunIcon = '../assets/icons/sun.svg';
  moonIcon = '../assets/icons/moon.svg';
  imgUrl!: string;
  // filter logic
  paid = true;
  pending = true;
  draft = true;

  constructor(private store: Store, public service: InvoiceService) {
    this.store.dispatch(loadInvoices());
  }

  ngOnInit() {
    this.invoices$ = this.store.select(selectFilteredInvoices);
    this.imgUrl = this.moonIcon;
  }

  // toggle dark mode icons (sun and moon)
  toggleDarkMode() {
    this.service.toggleDarkMode();
    if (this.service.isDarkMode) {
      this.imgUrl = this.sunIcon;
    } else {
      this.imgUrl = this.moonIcon;
    }
  }

  // filter logic
  onFilterChange(event: Event, filter: string) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.store.dispatch(InvoiceActions.addFilter({ filter }));
    } else {
      this.store.dispatch(InvoiceActions.removeFilter({ filter }));
    }
  }
}
