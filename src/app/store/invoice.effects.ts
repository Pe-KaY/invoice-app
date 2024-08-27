import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { InvoiceService } from '../service/invoice.service';
import * as InvoiceActions from './store.actions';
import { Invoice } from '../../interfaces/invoice-interface';


@Injectable()
export class InvoiceEffects {

  // Effect to load invoices
  loadInvoices$ = createEffect(() => this.actions$.pipe(
    ofType(InvoiceActions.loadInvoices),
    mergeMap(() => this.invoiceService.getInvoices()
      .pipe(
        map((invoices: Invoice[]) => {
            console.log(invoices);
           return  InvoiceActions.loadInvoicesSuccess({ invoices })}),
        catchError(error => of(InvoiceActions.loadInvoicesFailure({ error })))
      )
    )
  ));

  constructor(
    private actions$: Actions,
    private invoiceService: InvoiceService
  ) {}
}