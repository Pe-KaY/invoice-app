import { Component, Input } from '@angular/core';
import { Invoice } from '../../interfaces/invoice-interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent {


  @Input() invoice!: Invoice;


}
