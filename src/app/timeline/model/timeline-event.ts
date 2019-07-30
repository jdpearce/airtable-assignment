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
