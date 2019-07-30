export function getDaysDiff(from: Date, to: Date): number {
    return Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

export function getYearsDiff(start: Date, end: Date) {
    return end.getFullYear() - start.getFullYear() + 1;
}

export function getMonthsDiff(start: Date, end: Date) {
    let months: number = 0;
    months += (end.getFullYear() - start.getFullYear()) * 12;
    months -= start.getMonth() + 1;
    months += end.getMonth() + 1;
    return months < 0 ? 0 : months + 1;
}

// Gets the whole number of weeks (Mon - Sun) that cover the dates
export function getWeeksDiff(start: Date, end: Date) {
    console.log(start, end);
    let days = getDaysDiff(start, end);
    // why does javascript start weeks on Sunday? 🤦‍♀️
    let startDay = (start.getDay() + 6) % 7;
    let endDay = (end.getDay() + 6) % 7;
    days += startDay;
    days += 6 - endDay;
    return Math.ceil(days / 7);
}
