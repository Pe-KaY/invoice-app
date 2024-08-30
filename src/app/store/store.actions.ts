import { createAction, props } from '@ngrx/store';
import { Invoice } from '../../interfaces/invoice-interface';

// Action to add an invoice
export const addInvoice = createAction(
  '[Invoice] Add Invoice',
  props<{ invoice: Invoice }>()
);

export const updateInvoice = createAction(
  '[Invoice] Update Invoice',
  props<{invoice : Invoice}>()
)

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

// Action to mark an invoice as pending
export const markAsPending = createAction(
  '[Invoice] Mark As Pending',
  props<{ id: string }>()
);

// Action to mark an invoice as done
export const markAsDone = createAction(
  '[Invoice] Mark As Done',
  props<{ id: string }>()
);

// Action to mark an invoice as draft
export const markAsDraft = createAction(
  '[Invoice] Mark As Draft',
  props<{ id: string }>()
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
