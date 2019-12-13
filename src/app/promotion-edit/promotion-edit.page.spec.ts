import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PromotionEditPage } from './promotion-edit.page';

describe('PromotionEditPage', () => {
  let component: PromotionEditPage;
  let fixture: ComponentFixture<PromotionEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PromotionEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
