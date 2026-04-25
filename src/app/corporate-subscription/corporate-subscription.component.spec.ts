import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateSubscriptionComponent } from './corporate-subscription.component';

describe('CorporateSubscriptionComponent', () => {
  let component: CorporateSubscriptionComponent;
  let fixture: ComponentFixture<CorporateSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorporateSubscriptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CorporateSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
