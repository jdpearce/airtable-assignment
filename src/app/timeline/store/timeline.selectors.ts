import { createFeatureSelector } from '@ngrx/store';
import { TimelineState } from './timeline.reducer';

export const getTimelineState = createFeatureSelector<TimelineState>('timeline');
