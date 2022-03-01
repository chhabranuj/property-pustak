import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePropertyContentComponent } from './delete-property-content.component';

describe('DeletePropertyContentComponent', () => {
  let component: DeletePropertyContentComponent;
  let fixture: ComponentFixture<DeletePropertyContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletePropertyContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletePropertyContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
