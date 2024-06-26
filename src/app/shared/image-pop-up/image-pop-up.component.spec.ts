import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagePopUpComponent } from './image-pop-up.component';

describe('ImagePopUpComponent', () => {
  let component: ImagePopUpComponent;
  let fixture: ComponentFixture<ImagePopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImagePopUpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImagePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
