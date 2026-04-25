import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionEnabledComponent } from './subscription-enabled.component';

describe('SubscriptionEnabledComponent', () => {
  let component: SubscriptionEnabledComponent;
  let fixture: ComponentFixture<SubscriptionEnabledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionEnabledComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubscriptionEnabledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
