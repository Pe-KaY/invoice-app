import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceService } from '../service/invoice.service';
// imports forms
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
// import store
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Invoice } from '../../interfaces/invoice-interface';
import { AppState } from '../store/store.reducer';
import * as InvoiceActions from '../store/store.actions';
import { selectEditedInvoice } from '../selectors/invoice.selectors';

@Component({
  selector: 'app-edit-add-invoice',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-add-invoice.component.html',
  styleUrl: './edit-add-invoice.component.css',
})
export class EditAddInvoiceComponent {
  invoiceForm!: FormGroup;
  editedInvoice$!: Observable<Invoice | null>;
  formSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    public service: InvoiceService
  ) {
    this.editedInvoice$ = this.store.select(selectEditedInvoice);

    this.invoiceForm = this.fb.group({
      id: [``],
      createdAt: ['', Validators.required],
      paymentDue: [''],
      description: ['hello'],
      paymentTerms: [30, Validators.required],
      clientName: ['', Validators.required],
      clientEmail: ['', [Validators.required, Validators.email]],
      status: ['pending'],
      senderAddress: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        postCode: ['', Validators.required],
        country: ['', Validators.required],
      }),
      clientAddress: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        postCode: ['', Validators.required],
        country: ['', Validators.required],
      }),
      items: this.fb.array([]), // Assuming items will be handled separately
      total: [0],
    });
  }

  //  gets the items form array
  get itemsFormArray(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  //  adds an item to the form
  onAddItem() {
    const newItem = this.fb.group({
      name: ['', Validators.required],
      quantity: [0, Validators.required],
      price: [0, Validators.required],
      total: [0, Validators.required],
    });
    this.itemsFormArray.push(newItem);
  }

  //  removes an item from the form
  onRemoveItem(index: number) {
    this.itemsFormArray.removeAt(index);
  }

  // submits the form
  onSubmit() {
    if (this.invoiceForm.invalid) {
      this.formSubmitted = true;
    }
    // if form is valid
    if (this.invoiceForm.valid) {
      console.log('form is valid');

      const invoice: Invoice = this.invoiceForm.value;

      if (invoice.id) {
        this.store.dispatch(InvoiceActions.editInvoice({ invoice }));
      } else {
        invoice.id = this.generateRandomId();
        this.store.dispatch(InvoiceActions.addInvoice({ invoice }));
      }
      // hide the form
      this.service.modifyInvoice = false;

      // Optionally, reset the form after submission
      this.invoiceForm.reset();
    }
  }

  // random id generator
  generateRandomId() {
    // Generate the first 3 letters
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const randomLetters = Array.from({ length: 3 }, () =>
      letters.charAt(Math.floor(Math.random() * letters.length))
    ).join('');

    // Generate the next 4 digits
    const randomDigits = Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 10)
    ).join('');

    // Combine letters and digits
    return (randomLetters + randomDigits).toUpperCase();
  }
}
