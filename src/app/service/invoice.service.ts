import { Injectable } from '@angular/core';
import { Invoice } from '../../interfaces/invoice-interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient) { }

  getInvoices() {
    return this.http.get<Invoice[]>("../../assets/invoiceJson/data.json");
  }
}
