import { Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadInvoices } from './store/store.actions';
import { InvoiceComponent } from './invoice/invoice.component';
import { selectInvoices } from './selectors/invoice.selectors';
import { AppState } from './store/store.reducer';
import { Invoice } from '../interfaces/invoice-interface';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { InvoiceService } from './service/invoice.service';
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InvoiceComponent, CommonModule,ViewInvoiceComponent],
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

  constructor(private store: Store, public service: InvoiceService) {
    this.store.dispatch(loadInvoices());
  }

  ngOnInit() {
    this.invoices$ = this.store.select(selectInvoices);
    this.imgUrl = this.moonIcon
  }

  toggleDarkMode() {
    this.service.toggleDarkMode();
    if (this.service.isDarkMode) {
      this.imgUrl = this.sunIcon;
    } else {
      this.imgUrl = this.moonIcon;
    }
  }
}
