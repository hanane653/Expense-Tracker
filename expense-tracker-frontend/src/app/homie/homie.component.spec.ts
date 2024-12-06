import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomieComponent } from './homie.component';

describe('HomieComponent', () => {
  let component: HomieComponent;
  let fixture: ComponentFixture<HomieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
