import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewsEditPage } from './news-edit.page';

describe('NewsEditPage', () => {
  let component: NewsEditPage;
  let fixture: ComponentFixture<NewsEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewsEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
