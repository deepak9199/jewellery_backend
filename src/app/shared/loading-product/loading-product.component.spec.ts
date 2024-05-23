import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingProductComponent } from './loading-product.component';

describe('LoadingProductComponent', () => {
  let component: LoadingProductComponent;
  let fixture: ComponentFixture<LoadingProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoadingProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoadingProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
