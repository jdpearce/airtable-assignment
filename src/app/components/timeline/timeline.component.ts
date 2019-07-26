import { Component, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

export interface TimelineEvent {
    id: number;
    start: Date;
    end: Date;
    name: string;
    left?: number;
    width?: number;
}

export function timelineEventComparer(a: TimelineEvent, b: TimelineEvent): number {
    if (a.start < b.start) {
        return -1;
    }
    if (a.start === b.start) {
        return 0;
    }

    return 1;
}

@Component({
    selector: 'app-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnChanges {
    @Input() events: TimelineEvent[];

    lanes: Array<TimelineEvent[]> = [];
    scale: number;

    constructor(private renderer: Renderer2, private el: ElementRef) {}

    ngOnChanges() {
        this.events.sort(timelineEventComparer);
        const endDate = this.events.reduce((prev, curr) => (curr.end > prev.end ? curr : prev)).end;
        this.scale = 100 / this.getDays(this.events[0].start, endDate);
        this.fillLanes();
    }

    getDays(from: Date, to: Date): number {
        return Math.round(Math.abs((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)));
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
    }

    fillLanes(): void {
        for (let event of this.events) {
            event.width = this.getDays(event.start, event.end) * this.scale;
            event.left = this.getDays(this.events[0].start, event.start) * this.scale;

            let foundLane = false;
            for (let lane of this.lanes) {
                const lastEvent = lane[lane.length - 1];
                if (lastEvent.end < event.start) {
                    lane.push(event);
                    foundLane = true;
                    break;
                }
            }

            if (!foundLane) {
                this.lanes.push([event]);
            }
        }
    }
}
