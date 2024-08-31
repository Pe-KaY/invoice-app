import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState } from '../store/store.reducer';
import { Invoice } from '../../interfaces/invoice-interface';

// Create a feature selector for the 'app' slice of state
export const selectAppState = createFeatureSelector<AppState>('invoice');

//  selector to get the invoices
export const selectInvoices = createSelector(
  selectAppState,
  (state: AppState) => state.invoices
);
//  selector to get the selected filters
export const selectSelectedFilters = createSelector(
  selectAppState,
  (state: AppState) => state.selectedFilters
)

//  selector to view currently editing invoice
export const selectEditedInvoice = createSelector(
  selectAppState,
  (state: AppState) => state.editedInvoice
);

export const selectFilteredInvoices = createSelector(
  selectInvoices,
  selectSelectedFilters,
  (invoices: Invoice[], selectedFilters: string[]) => {
    if (selectedFilters.length === 3) {
      return invoices;
    } else {
      return invoices.filter(invoice => selectedFilters.includes(invoice.status));
    }
  }

  
);