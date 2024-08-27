import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayInvoicesComponent } from './display-invoices.component';

describe('DisplayInvoicesComponent', () => {
  let component: DisplayInvoicesComponent;
  let fixture: ComponentFixture<DisplayInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayInvoicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisplayInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
