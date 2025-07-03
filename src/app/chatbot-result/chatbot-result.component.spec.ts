import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotResultComponent } from './chatbot-result.component';

describe('ChatbotResultComponent', () => {
  let component: ChatbotResultComponent;
  let fixture: ComponentFixture<ChatbotResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatbotResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
