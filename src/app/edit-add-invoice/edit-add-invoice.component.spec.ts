import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAddInvoiceComponent } from './edit-add-invoice.component';

describe('EditAddInvoiceComponent', () => {
  let component: EditAddInvoiceComponent;
  let fixture: ComponentFixture<EditAddInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAddInvoiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditAddInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
