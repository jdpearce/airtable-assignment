import { Component, OnInit } from '@angular/core';
import { TimelineEvent } from './timeline/model';
import { timeLineEvents } from './timelineItems.constant';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    events: TimelineEvent[];

    ngOnInit() {
        this.events = timeLineEvents.map(
            ({ id, start, end, name }) =>
                ({
                    id,
                    start: new Date(start),
                    end: new Date(end),
                    name
                } as TimelineEvent)
        );
    }
}
