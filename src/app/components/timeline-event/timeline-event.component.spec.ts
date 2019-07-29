import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TimelineEventComponent } from './timeline-event.component';

describe('TimelineEventComponent', () => {
    let component: TimelineEventComponent;
    let fixture: ComponentFixture<TimelineEventComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TimelineEventComponent],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TimelineEventComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
