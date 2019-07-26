import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TimelineEvent } from '../timeline/timeline.component';

@Component({
    selector: 'app-timeline-event',
    template: `
        <div
            class="timeline-event"
            draggable="true"
            (dragstart)="onDragStart($event)"
            [ngStyle]="{ left: event.left + '%', width: (event.width > 10 ? event.width : 10) + '%' }"
        >
            {{ event && event.name }}
        </div>
    `,
    styleUrls: ['./timeline-event.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineEventComponent {
    @Input() event: TimelineEvent;

    ngOnInit() {}

    onDragStart(event) {
        console.log(event);

        // Add the id of the drag source element to the drag data payload so
        // it is available when the drop event is fired
        event.dataTransfer.setData('id', this.event.id.toString());
        // Tell the browser both copy and move are possible
        event.effectAllowed = 'move';
    }
}
