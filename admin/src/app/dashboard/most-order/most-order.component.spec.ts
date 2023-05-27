import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostOrderComponent } from './most-order.component';

describe('MostOrderComponent', () => {
  let component: MostOrderComponent;
  let fixture: ComponentFixture<MostOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
