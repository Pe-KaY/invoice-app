import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// store and services data imports
import { Invoice } from '../../interfaces/invoice-interface';
import { Store } from '@ngrx/store';
import { selectEditedInvoice } from '../selectors/invoice.selectors';
import { Observable } from 'rxjs';
import { InvoiceService } from '../service/invoice.service';
import { InvoiceItemsComponent } from '../invoice-items/invoice-items.component';

@Component({
  selector: 'app-view-invoice',
  standalone: true,
  imports: [CommonModule, InvoiceItemsComponent],
  templateUrl: './view-invoice.component.html',
  styleUrl: './view-invoice.component.css'
})
export class ViewInvoiceComponent {
  
  invoice$!: Observable<Invoice | null> 

  constructor(public service: InvoiceService, private store: Store) {}

  ngOnInit(): void {
    this.invoice$ = this.store.select(selectEditedInvoice)
  }

}
