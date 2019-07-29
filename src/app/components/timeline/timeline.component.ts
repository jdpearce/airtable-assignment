import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { getDaysDiff, getMonthsDiff, getWeeksDiff } from 'src/app/utils/date-helpers';

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

export enum ZoomLevel {
    Week = 'week',
    Month = 'month',
    Year = 'year'
}

@Component({
    selector: 'app-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnChanges {
    @Input() events: TimelineEvent[];

    lanes: Array<TimelineEvent[]> = [];
    columns: number[]; // these are the drop targets
    zoomLevel: ZoomLevel;
    scale: number;
    scaleStartDate: Date;
    scaleEndDate: Date;
    eventsEndDate: Date;
    eventsStartDate: Date;
    numberOfMonths: number;
    numberOfWeeks: number;
    numberOfDays: number;

    ngOnChanges(changes: SimpleChanges) {
        if (!changes.events) {
            return;
        }

        this.processEvents();
        this.fillLanes();
    }

    processEvents() {
        this.events.sort(timelineEventComparer);

        // lets set a default scale which contains the entire range to begin with
        this.eventsEndDate = this.events.reduce((prev, curr) => (curr.end > prev.end ? curr : prev)).end;
        this.eventsStartDate = this.events[0].start;

        this.numberOfMonths = getMonthsDiff(this.eventsStartDate, this.eventsEndDate);
        this.numberOfWeeks = getWeeksDiff(this.eventsStartDate, this.eventsEndDate);
        this.numberOfDays = getDaysDiff(this.eventsStartDate, this.eventsEndDate);

        if (this.eventsEndDate.getFullYear() !== this.eventsStartDate.getFullYear()) {
            this.setZoomLevel(ZoomLevel.Year);
        } else if (this.eventsEndDate.getMonth() !== this.eventsStartDate.getMonth()) {
            this.setZoomLevel(ZoomLevel.Month);
        } else {
            this.setZoomLevel(ZoomLevel.Week);
        }
    }

    setZoomLevel(zoom: ZoomLevel) {
        switch (zoom) {
            case ZoomLevel.Year: {
                this.scaleStartDate = new Date(this.eventsStartDate.getFullYear(), 0, 1);
                this.scaleEndDate = new Date(this.eventsStartDate.getFullYear(), 11, 31);
                this.columns = Array(this.numberOfMonths).fill(0);
                break;
            }
            case ZoomLevel.Month: {
                this.scaleStartDate = new Date(this.eventsStartDate.getFullYear(), this.eventsStartDate.getMonth(), 1);
                this.scaleEndDate = new Date(this.eventsStartDate.getFullYear(), this.eventsStartDate.getMonth() + 1, 0);
                this.columns = Array(this.numberOfWeeks).fill(0);
                break;
            }
            case ZoomLevel.Week:
            default: {
                this.scaleStartDate = new Date(
                    this.eventsStartDate.getFullYear(),
                    this.eventsStartDate.getMonth(),
                    this.eventsStartDate.getDate() - this.eventsStartDate.getDay() + 1
                );
                this.scaleEndDate = new Date(
                    this.eventsStartDate.getFullYear(),
                    this.eventsStartDate.getMonth(),
                    this.eventsStartDate.getDate() - this.eventsStartDate.getDay() + 7
                );
                this.columns = Array(this.numberOfDays).fill(0);
                break;
            }
        }

        this.zoomLevel = zoom;
        this.scale = 100 / getDaysDiff(this.scaleStartDate, this.scaleEndDate) + 1;

        console.log(
            `zoom level set to [${this.zoomLevel}] with scale [${this.scale}] from [${this.scaleStartDate}] to [${this.scaleEndDate}]`
        );
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
    }

    zoomIn() {
        switch (this.zoomLevel) {
            case ZoomLevel.Year:
                this.setZoomLevel(ZoomLevel.Month);
                this.fillLanes();
                break;
            case ZoomLevel.Month:
                this.setZoomLevel(ZoomLevel.Week);
                this.fillLanes();
                break;
            case ZoomLevel.Week:
                break;
        }
    }

    zoomOut() {
        switch (this.zoomLevel) {
            case ZoomLevel.Year:
                break;
            case ZoomLevel.Month:
                this.setZoomLevel(ZoomLevel.Year);
                this.fillLanes();
                break;
            case ZoomLevel.Week:
                this.setZoomLevel(ZoomLevel.Month);
                this.fillLanes();
                break;
        }
    }

    fillLanes(): void {
        this.lanes.length = 0;
        for (let event of this.events) {
            event.width = getDaysDiff(event.start, event.end) * this.scale;
            event.left = getDaysDiff(this.scaleStartDate, event.start) * this.scale;

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
