import { getDaysDiff, getMonthsDiff, getWeeksDiff } from './date-helpers';

describe('date helpers', () => {
    describe('getDaysDiff', () => {
        [
            { start: new Date(2019, 0, 1), end: new Date(2019, 0, 31), expected: 31 },
            { start: new Date(2019, 1, 1), end: new Date(2019, 1, 1), expected: 1 }
        ].forEach(testCase =>
            it(`should return ${testCase.expected} days from ${testCase.start} to ${testCase.end} inclusive`, () => {
                const actual = getDaysDiff(testCase.start, testCase.end);
                expect(actual).toBe(testCase.expected);
            })
        );
    });

    describe('getMonthsDiff', () => {
        [
            { start: new Date(2019, 0, 3), end: new Date(2019, 1, 28), expected: 2 },
            { start: new Date(2019, 1, 1), end: new Date(2019, 1, 1), expected: 1 },
            { start: new Date(2019, 0, 1), end: new Date(2020, 0, 1), expected: 13 }
        ].forEach(testCase =>
            it(`should return ${testCase.expected} months from ${testCase.start} to ${testCase.end} inclusive`, () => {
                const actual = getMonthsDiff(testCase.start, testCase.end);
                expect(actual).toBe(testCase.expected);
            })
        );
    });

    describe('getWeeksDiff', () => {
        [
            { start: new Date(2019, 0, 1), end: new Date(2019, 0, 6), expected: 1 },
            { start: new Date(2019, 0, 1), end: new Date(2019, 0, 8), expected: 2 }
        ].forEach(testCase =>
            it(`should return ${testCase.expected} week(s) from ${testCase.start} to ${testCase.end} inclusive`, () => {
                const actual = getWeeksDiff(testCase.start, testCase.end);
                expect(actual).toBe(testCase.expected);
            })
        );
    });
});
