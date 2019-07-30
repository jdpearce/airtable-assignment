import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { getDaysDiff, getWeeksDiff, getYearsDiff } from 'src/app/utils/date-helpers';

export interface TimelineEvent {
    id: number;
    start: Date;
    end: Date;
    name: string;
    left?: number;
    width?: number;
    colour?: string;
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

export const colours: string[] = ['#FF5D7D', '#FF764E', '#FFC144', '#88DF8E', '#00CCF2', '#B278D3'];

@Component({
    selector: 'app-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss'],
    providers: [DatePipe]
})
export class TimelineComponent implements OnChanges {
    @Input() events: TimelineEvent[];

    lanes: Array<TimelineEvent[]> = [];
    columns: string[]; // these are the drop targets
    columnWidth: number;
    zoomLevel: ZoomLevel;
    scale: number;
    scaleStartDate: Date;
    scaleEndDate: Date;
    eventsEndDate: Date;
    eventsStartDate: Date;
    numberOfYears: number;
    numberOfWeeks: number;
    numberOfDays: number;
    ZoomLevel = ZoomLevel;

    constructor(private datePipe: DatePipe) {}

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
        this.eventsStartDate = this.events[0].start;
        this.eventsEndDate = this.events.reduce((prev, curr) => (curr.end > prev.end ? curr : prev)).end;

        console.log(`time period starts on ${this.eventsStartDate} and ends on ${this.eventsEndDate}`);

        this.numberOfYears = getYearsDiff(this.eventsStartDate, this.eventsEndDate);
        this.numberOfWeeks = getWeeksDiff(this.eventsStartDate, this.eventsEndDate);
        this.numberOfDays = getDaysDiff(this.eventsStartDate, this.eventsEndDate);

        console.log(`time period has ${this.numberOfYears} years, ${this.numberOfWeeks} weeks and ${this.numberOfDays} days`);

        if (this.numberOfYears > 1 || this.numberOfWeeks > 4) {
            this.setZoomLevel(ZoomLevel.Year);
        } else if (this.numberOfDays > 7) {
            this.setZoomLevel(ZoomLevel.Month);
        } else {
            this.setZoomLevel(ZoomLevel.Week);
        }
    }

    setZoomLevel(zoom: ZoomLevel) {
        if (this.zoomLevel === zoom) {
            return;
        }

        switch (zoom) {
            case ZoomLevel.Year: {
                this.scaleStartDate = new Date(this.eventsStartDate.getFullYear(), 0, 1);
                this.scaleEndDate = new Date(this.eventsStartDate.getFullYear(), 11, 31);
                this.columns = Array(this.numberOfYears * 12)
                    .fill('month')
                    .map((_v, i) => {
                        const colDate = new Date(this.eventsStartDate.getFullYear(), this.scaleStartDate.getMonth() + i, 1);
                        return this.datePipe.transform(colDate, 'MMMM yyyy');
                    });
                this.columnWidth = 100 / 12;
                this.scale = 100 / getDaysDiff(this.scaleStartDate, this.scaleEndDate);
                break;
            }
            case ZoomLevel.Month: {
                this.scaleStartDate = new Date(this.eventsStartDate.getFullYear(), this.eventsStartDate.getMonth(), 1);
                this.scaleEndDate = new Date(this.eventsStartDate.getFullYear(), this.eventsStartDate.getMonth() + 1, 0);
                this.columns = Array(this.numberOfWeeks)
                    .fill('week')
                    .map((_v, i) => {
                        const colStartDate = new Date(this.eventsStartDate.getFullYear(), this.scaleStartDate.getMonth(), 1 + 7 * i);
                        const colEndDate = new Date(this.eventsStartDate.getFullYear(), this.scaleStartDate.getMonth(), 1 + 7 * (i + 1));
                        return `${this.datePipe.transform(colStartDate, 'dd MMM yyyy')} -    ${this.datePipe.transform(
                            colEndDate,
                            'dd MMM yyyy'
                        )}`;
                    });
                this.scale = 100 / getDaysDiff(this.scaleStartDate, this.scaleEndDate);
                this.columnWidth = 7 * this.scale;
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
                this.columns = Array(getDaysDiff(this.scaleStartDate, this.eventsEndDate))
                    .fill('day')
                    .map((_v, i) => {
                        const colDate = new Date(this.eventsStartDate.getFullYear(), this.scaleStartDate.getMonth(), 1 + i);
                        return this.datePipe.transform(colDate, 'EEE, dd MMM yyyy');
                    });
                this.scale = this.columnWidth = 100 / 7;
                break;
            }
        }

        this.zoomLevel = zoom;
        this.fillLanes();

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

    isZoomInDisabled(): boolean {
        return this.zoomLevel === ZoomLevel.Week;
    }

    isZoomOutDisabled(): boolean {
        return this.zoomLevel === ZoomLevel.Year;
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
        for (let i = 0; i < this.events.length; i++) {
            const event = this.events[i];

            // lets assume that the end date is included
            event.width = getDaysDiff(event.start, event.end) * this.scale;
            event.left = (getDaysDiff(this.scaleStartDate, event.start) - 1) * this.scale;
            event.colour = colours[i % colours.length];

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
