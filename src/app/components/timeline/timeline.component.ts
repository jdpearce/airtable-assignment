import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

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

    private readonly year = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    private readonly week = [1, 2, 3, 4, 5, 6, 7];

    ngOnChanges(changes: SimpleChanges) {
        if (!changes.events) {
            return;
        }

        this.processEvents();
        this.fillLanes();
    }

    processEvents() {
        this.events.sort(timelineEventComparer);

        // calculate the column widths and how many columns there are
        // lets set a default scale which contains the entire range to begin with
        this.eventsEndDate = this.events.reduce((prev, curr) => (curr.end > prev.end ? curr : prev)).end;
        this.eventsStartDate = this.events[0].start;
        console.log(this.eventsStartDate, this.eventsEndDate);

        if (this.eventsEndDate.getFullYear() !== this.eventsStartDate.getFullYear()) {
            this.setZoomLevel(ZoomLevel.Year);
        } else if (this.eventsEndDate.getMonth() !== this.eventsStartDate.getMonth()) {
            this.setZoomLevel(ZoomLevel.Month);
        } else {
            this.setZoomLevel(ZoomLevel.Week);
        }
    }

    setZoomLevel(zoom: ZoomLevel) {
        this.zoomLevel = zoom;

        switch (zoom) {
            case ZoomLevel.Year: {
                this.scaleStartDate = new Date(this.eventsStartDate.getFullYear(), 0, 1);
                this.scaleEndDate = new Date(this.eventsStartDate.getFullYear(), 11, 31);
                this.columns = this.year;
                break;
            }
            case ZoomLevel.Month: {
                this.scaleStartDate = new Date(this.eventsStartDate.getFullYear(), this.eventsStartDate.getMonth(), 1);
                this.scaleEndDate = new Date(this.eventsStartDate.getFullYear(), this.eventsStartDate.getMonth() + 1, 0);
                this.columns = Array(this.scaleEndDate.getDate() - 1).fill(1); // the actual value really doesn't matter;
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
                this.columns = this.week;
                break;
            }
        }
        this.scale = 100 / this.getDays(this.scaleStartDate, this.scaleEndDate) + 1;
        console.log(this.zoomLevel, this.scale, this.scaleStartDate, this.scaleEndDate);
    }

    getDays(from: Date, to: Date): number {
        return Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
    }

    private changePeriod(direction: number) {
        const currentYear = this.scaleStartDate.getFullYear();
        const currentMonth = this.scaleStartDate.getMonth();
        const currentDate = this.scaleStartDate.getDate();

        switch (this.zoomLevel) {
            case ZoomLevel.Year:
                this.scaleStartDate = new Date(currentYear + direction, 0, 1);
                this.scaleEndDate = new Date(currentYear + direction, 12, 0);
                break;
            case ZoomLevel.Month:
                this.scaleStartDate = new Date(currentYear, currentMonth + direction, 1);
                this.scaleEndDate = new Date(currentYear, currentMonth + direction + 1, 0);
                break;
            case ZoomLevel.Week:
                this.scaleStartDate = new Date(currentYear, currentMonth, currentDate + direction * 7);
                this.scaleEndDate = new Date(
                    this.scaleStartDate.getFullYear(),
                    this.scaleStartDate.getMonth(),
                    this.scaleStartDate.getDate() + 7
                );
                break;
        }
        console.log('period changed', this.zoomLevel, this.scaleStartDate, this.scaleEndDate);
        this.fillLanes();
    }

    nextPeriod() {
        this.changePeriod(1);
    }

    prevPeriod() {
        this.changePeriod(-1);
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

        // we only want to fill the lanes with the events that should be visible.
        // TODO : could do a binary search here to find the first event from which to start...
        // TODO : what do we do about events that straddle the zoom boundary?

        for (let event of this.events) {
            if (event.start > this.scaleEndDate || event.end < this.scaleStartDate) {
                continue;
            }

            event.width = this.getDays(event.start, event.end) * this.scale;
            event.left = this.getDays(this.scaleStartDate, event.start) * this.scale;

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
