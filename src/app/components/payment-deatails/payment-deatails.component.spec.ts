import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDeatailsComponent } from './payment-deatails.component';

describe('PaymentDeatailsComponent', () => {
  let component: PaymentDeatailsComponent;
  let fixture: ComponentFixture<PaymentDeatailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentDeatailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentDeatailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
