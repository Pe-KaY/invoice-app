import { Component, Input } from '@angular/core';
import { Invoice } from '../../interfaces/invoice-interface';
import { CommonModule } from '@angular/common';
import { InvoiceService } from '../service/invoice.service';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css',
})
export class InvoiceComponent {
  constructor(public service: InvoiceService) {}

  @Input() invoice!: Invoice;
}
