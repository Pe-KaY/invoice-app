import { createAction, props } from '@ngrx/store';
import { Invoice } from '../../interfaces/invoice-interface';

// Action to add an invoice
export const addInvoice = createAction(
  '[Invoice] Add Invoice',
  props<{ invoice: Invoice }>()
);

export const updateInvoice = createAction(
  '[Invoice] Update Invoice',
  props<{ invoice: Invoice }>()
);

// Action to edit an invoice
export const editInvoice = createAction(
  '[Invoice] Edit Invoice',
  props<{ invoice: Invoice }>()
);

// Action to delete an invoice
export const deleteInvoice = createAction(
  '[Invoice] Delete Invoice',
  props<{ id: string }>()
);
// clear edited invoice
export const clearEditedInvoice = createAction(
  '[Invoice] Clear Edited Invoice'
);

// Action to load invoices from a service
export const loadInvoices = createAction('[Invoice] Load Invoices');

export const loadInvoicesSuccess = createAction(
  '[Invoice] Load Invoices Success',
  props<{ invoices: Invoice[] }>()
);

export const loadInvoicesFailure = createAction(
  '[Invoice] Load Invoices Failure',
  props<{ error: any }>()
);
