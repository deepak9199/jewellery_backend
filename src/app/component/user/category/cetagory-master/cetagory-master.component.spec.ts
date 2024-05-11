import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CetagoryMasterComponent } from './cetagory-master.component';

describe('CetagoryMasterComponent', () => {
  let component: CetagoryMasterComponent;
  let fixture: ComponentFixture<CetagoryMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CetagoryMasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CetagoryMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
