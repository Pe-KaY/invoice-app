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
      invoices: [...state.invoices, invoice]
    })),
    on(InvoiceActions.editInvoice, (state, { invoice }) => ({
      ...state,
      editedInvoice: invoice
    })),
    on(InvoiceActions.deleteInvoice, (state, { id }) => ({
      ...state,
      invoices: state.invoices.filter(invoice => invoice.id !== id)
    })),
    on(InvoiceActions.markAsPending, (state, { id }) => ({
      ...state,
      invoice: state.invoices.map(invoice =>
        invoice.id === id ? { ...invoice, status: 'pending' } : invoice
      )
    })),
    on(InvoiceActions.markAsDone, (state, { id }) => ({
      ...state,
      invoice: state.invoices.map(invoice =>
        invoice.id === id ? { ...invoice, status: 'paid' } : invoice
      )
    })),
    on(InvoiceActions.markAsDraft, (state, { id }) => ({
      ...state,
      invoice: state.invoices.map(invoice =>
        invoice.id === id ? { ...invoice, status: 'draft' } : invoice
      )
    })),
    on(InvoiceActions.loadInvoicesSuccess, (state, { invoices }) => ({
      ...state,
      invoices
    })),
    // Optionally handle failures, you may want to add error handling in the state
    // on(InvoiceActions.loadInvoicesFailure, (state, { error }) => ({
    //   ...state,
    //   error
    // }))
  );