import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TimelineEvent } from '../../model';

@Component({
    selector: 'app-timeline-event',
    template: `
        <div
            class="timeline-event"
            draggable="true"
            (dragstart)="onDragStart($event)"
            [ngStyle]="{ left: (event && event.left) + '%', width: (event && event.width) + '%', background: event && event.colour }"
        >
            {{ event && event.name }}
        </div>
    `,
    styleUrls: ['./timeline-event.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineEventComponent {
    @Input() event: TimelineEvent;

    onDragStart(event) {
        // Add the id of the drag source element to the drag data payload so
        // it is available when the drop event is fired
        event.dataTransfer.setData('id', this.event.id.toString());
        // Tell the browser both copy and move are possible
        event.effectAllowed = 'move';
    }
}
