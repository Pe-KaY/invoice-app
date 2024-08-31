import { Component, ElementRef, ViewChild } from '@angular/core';
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
  invoiceId!: string;
  // payment terms and date values
  termsValue!: number;
  termsString!: string;
  invoiceDate!: Date;
  paymentDue!: Date;

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
      paymentTerms: [30],
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

      // Set the invoice ID 
      this.invoiceId = invoice?.id || '';
    });

    // PAYMENT DATE AND TERMS LOGIC

    // update payment terms and date string
    this.termsValue = this.invoiceForm.get('paymentTerms')?.value;
    this.updateTermsString();
    // set date for new Invoices (if 'createdAt' is empty or null)
    this.setDate();
  }

  // updates payment terms string on form
  onTermsChange(days: string) {
    if (days.includes('1')) this.termsValue = 1;
    if (days.includes('7')) this.termsValue = 7;
    if (days.includes('14')) this.termsValue = 14;
    if (days.includes('30')) this.termsValue = 30;
    this.updateTermsString();
  }

  // set Date for new Invoices()
  setDate() {
    const currentDate = new Date().toISOString().split('T')[0];
    // Check if the 'createdAt' field is empty or null
    if (!this.invoiceForm.get('createdAt')?.value) {
      this.invoiceForm.patchValue({
        createdAt: currentDate,
      });
    }
  }

  // format date to string function
  dueDate() {
    const currentDate = this.invoiceForm.get('createdAt')?.value;
    // Convert the string date to a Date object
    let date = new Date(currentDate);
    // Add 30 days to the date
    date.setDate(date.getDate() + this.termsValue);
    // Convert back to YYYY-MM-DD format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
    // this.invoiceForm.patchValue({
    //   paymentDue: `${year}-${month}-${day}`,
    // });
  }

  // update payment terms string in form
  updateTermsString() {
    this.termsString =
      this.termsValue === 1
        ? `Net ${this.termsValue} Day`
        : `Net ${this.termsValue} Days`;
  }

  // ADDING ITEMS TO FORM LOGIC

  //  gets the items from form
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

  // SAVING NEW OR EDITED INVOICE LOGIC
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
    // Calculate total based on items
    let total = 0;
    if (invoice.items && invoice.items.length > 0) {
      invoice.items.forEach((item) => {
        total += item.quantity * item.price; // Calculate total as quantity * price
        // calculate individual item total
        item.total = item.quantity * item.price;
      });
      invoice.total = total;
    }
    // set payment terms(will be updated if modified in the form else remains same)
    invoice.paymentTerms = this.termsValue;
    // sets payment due date(will be updated if modified in the form else remains same)
    invoice.paymentDue = this.dueDate();
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
      // if form has no id then its a new invoice
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
