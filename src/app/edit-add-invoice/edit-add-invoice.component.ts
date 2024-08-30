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
import * as InvoiceActions from '../store/store.actions';
import { selectEditedInvoice } from '../selectors/invoice.selectors';
import { log } from 'node:console';

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
      description: ['', Validators.required],
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

  // ngOnInit
  ngOnInit() {
    this.editedInvoice$.subscribe((invoice) => {
      if (invoice) {
        this.invoiceForm.patchValue(invoice);
        this.setItems(invoice.items); // Initialize the items array if editing
      }
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
  // sets items in the form when editing
  setItems(items: any[]) {
    const itemsFormArray = this.itemsFormArray;
    items.forEach((item) => {
      itemsFormArray.push(
        this.fb.group({
          name: [item.name, Validators.required],
          quantity: [item.quantity, Validators.required],
          price: [item.price, Validators.required],
          total: [item.total, Validators.required],
        })
      );
    });
  }

  //  removes an item from the form
  onRemoveItem(index: number) {
    this.itemsFormArray.removeAt(index);
  }

  // save invoice
  onSave() {
    // checks if form is not valid
    if (this.invoiceForm.invalid) {
      this.formSubmitted = true;
      return;
    }
    // if form is valid
    // gets form data
    const invoice: Invoice = this.invoiceForm.value;

    // if form has id then its being edited
    if (invoice.id) {
      // update store edited invoice with currently editing invoice
      this.store.dispatch(InvoiceActions.updateInvoice({ invoice }));
      // hide the form
      this.service.modifyInvoiceToggle();
      // Optionally, reset the form after submission
      this.invoiceForm.reset();
      return;
    } else {
      // add id for new invoices
      invoice.id = this.generateRandomId();
      // set status to pending
      invoice.status = 'pending';
      // add to store
      this.store.dispatch(InvoiceActions.addInvoice({ invoice }));
    }
    // hide the form
    this.service.modifyInvoiceToggle();
    // back to invoice list
    this.service.closeViewInvoice();
    // Optionally, reset the form after submission
    this.invoiceForm.reset();
  }

  // save as draft
  onSaveAsDraft() {
    // checks if form is valid
    if (this.invoiceForm.invalid) {
      this.formSubmitted = true;
      return;
    }
    // gets form data
    const invoice: Invoice = this.invoiceForm.value;
    //set status to draft
    invoice.status = 'draft';
    // add id
    invoice.id = this.generateRandomId();
    this.store.dispatch(InvoiceActions.addInvoice({ invoice }));
    // hide the form
    this.service.modifyInvoiceToggle();
    // back to invoice list
    this.service.closeViewInvoice();
    // Optionally, reset the form after submission
    this.invoiceForm.reset();
  }

  // discard the form
  onDiscard() {
    // hide the form
    this.service.modifyInvoiceToggle();
    // clears form
    this.invoiceForm.reset();
  }

  // random id generator
  generateRandomId() {
    // Generate the first 3 letters
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const randomLetters = Array.from({ length: 2 }, () =>
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
