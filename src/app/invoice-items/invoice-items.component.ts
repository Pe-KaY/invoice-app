import { Component, Input } from '@angular/core';
import { InvoiceService } from '../service/invoice.service';
import { Item } from '../../interfaces/invoice-interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invoice-items',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice-items.component.html',
  styleUrl: './invoice-items.component.css'
})
export class InvoiceItemsComponent {

  constructor(public service: InvoiceService){}

  @Input() items!: Item;

}
