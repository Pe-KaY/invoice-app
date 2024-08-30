import { createReducer, on } from '@ngrx/store';
import * as InvoiceActions from './store.actions';
import { Invoice } from '../../interfaces/invoice-interface';

export interface AppState {
  invoices: Invoice[]; // Array of invoices
  editedInvoice: Invoice | null; // Currently editing invoice or null if not editing
}
export const initialState: AppState = {
  invoices: [],
  editedInvoice: null,
};

export const invoiceReducer = createReducer(
  initialState,
  on(InvoiceActions.addInvoice, (state, { invoice }) => ({
    ...state,
    invoices: [...state.invoices, invoice],
    editedInvoice: null,
  })),
  on(InvoiceActions.updateInvoice, (state, { invoice }) => ({
    ...state,
    invoices: state.invoices.map((i) => (i.id === invoice.id ? invoice : i)),
    editedInvoice: invoice,
  })),
  on(InvoiceActions.editInvoice, (state, { invoice }) => ({
    ...state,
    editedInvoice: invoice,
  })),
  on(InvoiceActions.deleteInvoice, (state, { id }) => ({
    ...state,
    invoices: state.invoices.filter((invoice) => invoice.id !== id),
  })),
  on(InvoiceActions.clearEditedInvoice, (state) => ({
    ...state,
    editedInvoice: null,
  })),
  on(InvoiceActions.loadInvoicesSuccess, (state, { invoices }) => ({
    ...state,
    invoices,
  }))
  // Optionally handle failures, you may want to add error handling in the state
  // on(InvoiceActions.loadInvoicesFailure, (state, { error }) => ({
  //   ...state,
  //   error
  // }))
);
