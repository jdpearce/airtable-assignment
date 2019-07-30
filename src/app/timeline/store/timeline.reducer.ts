import { Action, createReducer } from '@ngrx/store';

export interface TimelineState {}

export const initialTimelineState: TimelineState = {};

const reducer = createReducer(initialTimelineState);

export function timelineReducer(state: TimelineState | undefined, action: Action): TimelineState {
    return reducer(state, action);
}
