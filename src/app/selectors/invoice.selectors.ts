import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState } from '../store/store.reducer';
import { Invoice } from '../../interfaces/invoice-interface';

// Create a feature selector for the 'app' slice of state
export const selectAppState = createFeatureSelector<AppState>('invoice');

// Create a selector to get the invoices
export const selectInvoices = createSelector(
  selectAppState,
  (state: AppState) => state.invoices
);